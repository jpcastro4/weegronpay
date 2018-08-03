var site = 'http://localhost/ellobeta/api/rs/'

var app = {

    initialize: function(){
        //$.fn.dataTable.ext.errMode = 'throw';
        localStorage.setItem('empresaId',1)

        this.initPages()
        
        $('#save-prod').on('click', function (e) {
            e.preventDefault()
            app.prodInsert()
        })

        $('button#save-empresa').on('click', function (e) {
            e.preventDefault()
            app.empresaInsert()
        })

        $('input.required').on('keyup', function(){
            $(this).css('border-color','rgba(0,0,0,.15)')
        })

        $('.modal#busca-cliente').on('show.bs.modal', function(e){
            app.buscaClientes()
        })

        $('.modal#busca-produtos').on('show.bs.modal', function (e) {
            
        })
    },
    initPages: function(){
        if($('.page#homologa').is(':visible')) {
            this.pageHomologa()
        }

        if ($('.page#empresa').is(':visible')) {
            this.pageEmpresa()
        }

        if ($('.page#produtos').is(':visible')) {
            this.pageProdutos()
        }

        if ($('.page#pedidos').is(':visible')) {
            this.pagePedidos()
        }

        if ($('.page#pedido').is(':visible')) {
            this.pagePedido()
        }
    },
    openPage: function(pageId){
        
        $('body').find('.page').each(function(){
            $(this).removeClass('active-page')
        })
        $('#' + pageId).addClass('active-page')

        this.initPages()
    },
    ajax:  function (type, action, data, callback) {

        $.ajax({
            type: type,
            url: site + action,
            data: data,
            dataType: 'json',
            success: function (data) {
                return callback(data)
            },
            error: function (data) {
                return callback({ error: true, data: data })
            }
        })

    },
    pageEmpresa: function () {
        
        this.ajax('get','empresas?empresaId='+localStorage.getItem('empresaId'),'',function(res){
            if(res.error){
                console.log(res)
            }else{
                var i = res.data

                $('#empresa form').find('input').each(function(){
                    var $this = $(this)

                    $.each(i, function(i,e){
                        if( $this.attr('name') == i ){
                            $this.val(e)
                        }
                    })
                })
            }
            
        })
    },
    empresaInsert: function () {

        var form = $('form#empresa-insert'), action = form.attr('action'), data = form.serialize(), save = true

        form.find('input').each(function () {

            if ($(this).attr('required') && $(this).val() == '') {
                $(this).css('border-color', 'red').addClass('required')
                save = false
            } else {
                $(this).css('border-color', 'rgba(0,0,0,.15)').removeClass('required')
            }
        })

        if (save) {
            this.ajax('post', action, data, function (res) {
                //console.log(res)
                location.reload()
            })
        }
    },

    //AREA DE PRODUTOS
    pageProdutos: function(){

        $('.loading').show()
        app.prodList()

        var table = $('#table-prod').DataTable();
        $('#table-prod').on('click', 'tr', function(){
            table.rows().deselect();
            var prodId = table.row($(this)).select().id()

            app.prodEdit(prodId)
        })


        $('.loading').hide()
 
    },
    prodList: function(){

        $('#table-prod').DataTable({
            ajax: {
                url: site + 'produtos',
                dataSrc: 'data',
                type: "GET",
            },
            
            columnDefs: [{
                orderable: false,
                className: 'select-checkbox',
                targets: 0
            }],
            select: true,
            rowId: 'prodId',
            columns: [
                { data: "prodId" },
                { data: "prodCod" },
                { data: "prodEAN" },
                { data: "prodNome" },               
                { data: "prodPreco" },
                { data: "prodCateg" }
            ]
        })
    },
    prodInsert: function () {
        $('.loading').show()
        var form = $('form#prod-insert'), action = form.attr('action'), data = form.serializeJSON(), save = true

        if(data.prodId){
            action = action+'?prodId='+data.prodId
        } 
 
        form.find('input').each(function () {

            if ($(this).attr('required') && $(this).val() == '') {
                $(this).css('border-color', 'red').addClass('required')
                save = false
            } else {
                $(this).css('border-color', 'rgba(0,0,0,.15)').removeClass('required')
            }
        })


        if (save) {
            this.ajax('POST', action, data, function (res) {
                if (res.error) {
                    alert('Erro ao inserir')
                    $('.loading').hide()
                } else {

                    form
                        .not(':button, :submit, :reset, :hidden')
                        .val('')
                        .removeAttr('checked')
                        .removeAttr('selected');

                    //app.pageProdutos()

                    $('#table-prod').DataTable().ajax.reload()
                    $('.loading').hide()
                }
            })
        }else{
            $('.loading').hide()
        }
    },
    prodEdit: function(prodId){
        
        app.ajax('GET','produtos?prodId='+prodId, '', function(res){
            if(res.error){
                console.log(res.data)
            }else{
                 
                $('#prod-insert').find('input').each(function(){
                    var inputForm = $(this)
                    
                    $.each(res, function (k, i) {
                        if (inputForm.attr('name') == k ){
                            inputForm.val(i)
                        }
                    })
                })
            }
        })
        
    },
    listaClientes: function () {

        this.ajax('get', 'clientes', null, function (rs) {
            console.log(rs)
        })
    },
    
    novoCliente: function(){       
        
        var form = $('form#novo-cliente'), action = form.attr('action'), data = form.serialize(), save = true
        
        form.find('input').each(function () {

            if ($(this).attr('required') && $(this).val() == '') {
                $(this).css('border-color', 'red').addClass('required')
                save = false
            } else {
                $(this).css('border-color', 'rgba(0,0,0,.15)').removeClass('required')
            }
        })

        if (save) {

            this.ajax('POST', action+'?empresaId='+localStorage.getItem('empresaId'), data, function (rs) {

                if(rs.error){
                    console.log(rs.data.responsJSON)
                }else{
                    console.log(rs.message)
                    $('#modal-novo-cliente').modal('hide')
                    app.buscaClientes()
                }
            })

        } else {
            $('.loading').hide()
        }   
    },

    //AREA DE PEDIDOS

    
    pagePedidos: function(){
        
        $('#table-pedidos').DataTable({
            ajax: {
                url: site + 'pedidos',
                dataSrc: 'data',
                type: "GET",
            },
            // columnDefs: [{
            //     orderable: false,
            //     className: 'select-checkbox',
            //     targets: 0
            // }],
            // select: {
            //     style: 'os',
            //     selector: 'td:first-child'
            // },
            // rowId: 'pedidoId',
            columns: [
                null,
                { data: "pedidoId" },
                { data: "clienteNomeRazao" },
                { data: "pedidoTotal" },
                { data: "pedidoData" }
            ]
        })

        $('.loading').hide()
    },
    novoPedido: function (clienteId) {

        app.ajax('POST', 'pedidos?empresaId=' + localStorage.getItem('empresaId'), { clienteId: clienteId }, function (res) {

            if (res.error) {
                console.log(res.data.responseJSON.message)
            } else {
                console.log("Pedido aberto")
                localStorage.setItem('pedidoId', res.pedidoId)
                $('#num-pedido').html('Pedido n° ' + res.pedidoId)
                $('#pedido-cliente').append('<input name="pedidoId" type="hidden" value="' + res.pedidoId + '"')
            }
        })

    },

    // PEDIDO 

    
    buscaClientes: function () {
        $('#busca-cliente').find('select#clientes-lista').html('')

        app.ajax('GET', 'clientes?empresaId=' + localStorage.getItem('empresaId'), '', function (res) {

            if (res.error) {
                $('#busca-cliente').find('select#clientes-lista').append('<option selected >' + res.data.responseJSON.message + '</option>')

            } else {
                res.forEach(function (k, i) {
                    $('#busca-cliente').find('select#clientes-lista').append('<option value="' + k.clienteId + '" >' + k.clienteNomeRazao + '</option>')
                })
            }
        })

        $('#seleciona-cliente').on('click', function () {

            var cliente = $(this).parents('#busca-cliente').find('select option:selected')

            $('#pedido').find('input').each(function (k, i) {

                if ($(this).attr('name') == 'clienteId') {
                    $(this).val(cliente.val())
                }

                if ($(this).attr('name') == 'clienteNomeRazao') {

                    $(this).val(cliente.text())
                }
            })
            
            $('#busca-cliente').modal('hide')
            //app.novoPedido(cliente.val())
        })

    },
    buscaProdutos: function () {

        $('#lista-busca-produtos').DataTable({
            ajax: {
                url: site + 'produtos',
                dataSrc: 'data',
                type: "GET",
            },

            columnDefs: [{
                orderable: false,
                className: 'select-checkbox',
                targets: 0
            }],
            select: true,
            rowId: 'prodId',
            columns: [
                { data: "prodId" },
                { data: "prodCod" },
                { data: "prodEAN" },
                { data: "prodNome" },
                { data: "prodPreco" },
                { data: "prodCateg" }
            ]
        })

        var table = $('#lista-busca-produtos').DataTable();
        table.on('click', 'tr', function () {
            table.rows().deselect();
            var prodId = table.row($(this)).select().id()

            app.pedProdInsert(prodId)
            $('#busca-produtos').modal('hide')

        })

    },
    listaProdsPedido: function () {

        var prods = JSON.parse(localStorage.getItem('prods'))

        console.log(prods)

        $.each(prods, function (k, i) {

            $('#table-pedido-produtos body').append('<tr><td>' + i.prodId + '</td><td>' + i.prodNome + '</td><td>' + i.pedProdPreco + '</td><td>' + i.pedProdQtd + '</td><td>' + i.pedProdSub +'</td><td><span class="fa fa-close"></span></td></tr>') 
            console.log(i)
        })

        
    },

    pagePedido: function () {

        var pedidoId = localStorage.getItem('pedidoId')

        app.buscaProdutos()

        if (pedidoId != null) {

            app.ajax('GET', 'pedidos?pedidoId=' + pedidoId, '', function (res) {

                if (res.error) {
                    console.log(res.data.responseJSON.message)
                } else {

                    $('#num-pedido').html("Pedido N° " + res.data.pedido.pedidoId)

                    $('form#pedido-cliente input[name=clienteId]').val(res.data.pedido.clienteId)
                    $('form#pedido-cliente input[name=clienteNomeRazao]').val(res.data.pedido.clienteNomeRazao)

                    localStorage.setItem('prods', JSON.stringify(res.data.produtos))

                    app.listaProdsPedido()

                }
            })
        }

        $('.loading').hide()
    },
    
    pedProdInsert: function(prodId){

        var pedidoId = localStorage.getItem('pedidoId'), prodId = prodId
                
        app.ajax('POST','pedidos/produtos?pedidoId='+pedidoId, {prodId:prodId},function(res){

            if(res.error){
                //console.log(res.data.responseJSON.message)
                console.log(res)
            }else{
                console.log(res)
            }
        })
    },

    editPedProdEdit: function(){


    }

}



 