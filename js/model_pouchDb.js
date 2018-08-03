var model = {

    ApiUrl: ()=>{

        if (device.platform == 'browser') {
            
            return 'http://ellobeta.com/api/rs/'
        }

        if (device.platform == 'Android') {
 
            return 'http://ellobeta.com/api/rs/'
        }
    },
    
    // FUNCTIONS
    ajax: (type, action, data, callback)=>{

        $.ajax({
            type: type,
            url: model.ApiUrl() + action,
            data: data,
            dataType: 'json',
            crossDomain: true,
            success:  (data)=>{
                return callback(data)
            },
            error:  (data)=>{
                return callback({ error: true, data: data })
            }
        })
        
    },
    connection:  ()=>{
        
        var networkState = navigator.onLine

        return networkState
    },
    openPage:  (page, back = false)=>{

        $('body').find('.page').addClass('hidden')

        $('#' + page).removeClass('hidden')


        if (back) {
            //$('#' + page + ' .corpo').removeClass('slideInRight').addClass('slideInLeft')

        } else {
            //$('#' + page + ' .corpo').removeClass('slideInLeft').addClass('slideInRight')
        }

        //se volta não guarda no histórcio
        if (back == false) {
            if (page == 'sync') {
                historico = []
            } else {
                if (page != 'coleta') {

                    if (historico[historico.length - 1] != page) {
                        historico.push(page)
                    }
                }
            }
        }

        controller.initPages()
        // if (page == 'coleta') {

        //     init.back(false)
        //     document.removeEventListener("backbutton", init.onBackKeyDown, false);
        // } else {
        //     document.addEventListener("backbutton", init.onBackKeyDown, false);
        // }

        //init.modoSync()
    },
    loading:  (action)=>{

        if (action == 'open') {
            $('.loading').removeClass('hidden').show()
        }

        if (action == 'close') {
            $('.loading').addClass('hidden').hide()
        }

    },
      
    sendLog:  (log)=>{

        $('.infopage .consolelog').html(log)

        $.post(url + 'log', { message: log },  (dt) =>{

            alert('Log enviado')
        })

    },
    htmlLog: (log)=>{

        $('.page').not('.hidden').append('<div class="">'+JSON.stringify(log)+'</div>')
    },

    refreshToken:  (registration)=>{

        if (localStorage.getItem('dispId')){
            model.ajax('post', 'dispositivos/?dispId=' + localStorage.getItem('dispId'), { dispNotifId: registration }, (res) => {

                console.log(res)
                if (res.error) {
                    console.log(res)
                    model.htmlLog(res)
                    alert('Erro na autenticação Push')
                    M.toast({ html: 'Erro na autenticação Push' })
                } else {
                    console.log('PUSH ATUALIZADO')
                }
            })
        }else{
            M.toast({ html: 'Solicite homologacao' })
        }
    },

    homologa:  ()=>{

        model.loading('open')

        if (!model.connection()) {
            
            M.toast({ html: 'Verifique a internet' })
            model.loading('close')
            return 
        }

        var dados = $('#form-homologa').serializeJSON()
       
        if (dados.empresaCnpj == null) {
            M.toast({ html: 'Informe o CNPJ por favor' })
            return
        }


        localStorage.setItem('empresaCnpj',dados.empresaCnpj)

        var params = '/?deviceId=' + deviceID + '&empresaCnpj=' + dados.empresaCnpj
        
        model.ajax('get', 'homologa'+params, '', (res)=>{
             
            if(res.error){
                console.log(res.data)
                
                M.toast({ html: res.data.responseJSON.message })
                if(res.data.status == 400 ){
                    localStorage.setItem('homologaStatus', res.data.responseJSON.status)
                }
                model.loading('close')
                                                
            }else{
                console.log(res )
                M.toast({ html: res.message })
                if(res.status == null ){
                    model.execHomologa()
                }else{
                    localStorage.setItem('homologaStatus',res.status)
                    model.openPage('homologacao')
                }

                model.loading('close')
            }
        })     

    },   

    execHomologa: ()=>{ 
        model.loading('open') 

        M.toast({ html: 'Iniciando homologação' })

        console.log('Internet ' + model.connection())

        if (!model.connection()) {

            M.toast({ html: 'Verifique a internet' })
            model.loading('close')            
        }

        var dados = $('#form-homologa').serializeJSON()
        
        if (dados.empresaCnpj == null){
            M.toast({ html: 'Informe o CNPJ por favor' })
            return
        }
        
        var post = { deviceId: deviceID, deviceNotifReg: localStorage.getItem('registrationId'), empresaCnpj: dados.empresaCnpj }

            model.ajax('post','homologa',post , (res)=>{
                 
                if (res.error) {

                    console.log(res.data)     
                    
                    M.toast({ html: res.data.responseJSON.message })
                        
                } else {
                    console.log(res)
 
                    localStorage.setItem('dispId',res.dispId)
                    M.toast({ html: res.message })
  
                }

            })
    },

    initTelas: () => {
        model.loading('open')

        if (localStorage.getItem('homologaStatus') == 1 || localStorage.getItem('homologaStatus') == null) {

            model.loading('close')
            model.openPage('homologacao')
        }

        if (localStorage.getItem('homologaStatus') == 2) {

            model.loading('close')
            if (device.platform == 'browser') {
                model.syncBD()
            }
            model.openPage('login')
        }

        if (localStorage.getItem('homologaStatus') == 3) {

            model.loading('close')
            model.openPage('homologacao')
        }
    },

    executePush: (data)=>{

        const type = data.additionalData.type
        
        switch (type) {
            case 'switchStatus':
                model.switchStatus(data)
                break;
        
            default:
                break;
        }
    },

    switchStatus: (data)=>{      
        
        localStorage.setItem('homologaStatus', data.additionalData.status)

        if (data.additionalData.status == 2){
            model.syncBD()
        }

        if (data.additionalData.status != 2) {
            model.sair()
        }

        M.toast({ html: data.message })
        model.initTelas()
    },

    syncBD: ()=>{
        model.loading('open')

        model.ajax('get','base?empresaCnpj='+localStorage.getItem('empresaCnpj'),'', (res)=>{
            
            if(res.error){
                alert('Erro sync DB')
            }
            else{
                
                if(res.content){
                    console.log(res)
                    db.syncTables(res.content)
                    model.loading('close')
                }
            }
        })
    },

    login: ()=>{

        model.loading('open')

        var credenciais = $('#form-login').serializeJSON()
        
        db.login(credenciais, (rs)=>{
             
            if(rs.error){
                model.loading('close')
                M.toast({ html: rs.message })
            }else{
                model.loading('close')
                model.openPage('pedidos')
            }

        })

    },
    sair: () => {

        // if (typeof cordova !== 'undefined') {
        //     if (navigator.app) {
        //         navigator.app.exitApp()
        //     }
        //     else if (navigator.device) {
        //         navigator.device.exitApp()
        //     }
        // } else {
        //     window.close();
        //     $timeout(function () {
        //         self.showCloseMessage = true
        //     })
        // }

        localStorage.setItem('user_log', false)
        model.openPage('login')
    },
    pagePedidos: () => {

        model.loading('open')

        db.pedidosAbertos((res) => {
            if (res.total_rows > 0) {
                view.pedidosAbertos(res.rows)
            } else {
                view.pedidosAbertos(false)
            }
        })

        // db.pedidosAguardando((res) => {
        //     if (res.total_rows > 0) {
        //         view.pedidosAbertos(res.rows)
        //     } else {
        //         view.pedidosAguardando(false)
        //     }
        // })

        db.pedidosFechados((res) => {
            if (res.total_rows > 0) {
                view.pedidosFechados(res.rows)
            } else {
                view.pedidosFechados(false)
            }
        })

        model.loading('close')

    },
     
    novoPedido: () => {
        let pedido = {
            PEDIDO_ID: $.now(),
            REPRESENTANTE_COD: JSON.parse(localStorage.getItem('user_log')).CODIGO,
            PEDIDO_STATUS:'ABERTO',
            NOTA_FISCAL:false
        }

        localStorage.setItem('pedido', JSON.stringify(pedido))
        model.openPage('clientes')
    },

    buscaCliente: ()=>{

        model.loading('open')

        let params = $('form#busca-cliente').serializeJSON()
        
        if ($('#filters').is(':visible')) {
            $('#filters').addClass('hidden')
        }

        db.getCliente(params, (res)=>{
             
            if(res.total_rows > 0 ){
                view.listaClientes(res.rows)
            }else{
                M.toast({html:'Nenhum cliente encontrado'})
            }
            
            model.loading('close')
        })

    },

    addClientePedido: (data)=>{

        const cliente = JSON.parse(decodeURIComponent(data))
        const CLIENTE_ID = JSON.parse(decodeURIComponent(data)).CODIGO
        let pedido = JSON.parse(localStorage.getItem('pedido'))

        delete cliente._rev
        pedido.CLIENTE_COD = CLIENTE_ID
        pedido.s = cliente
        
        localStorage.setItem('pedido', JSON.stringify(pedido))

        //salva o pedido que até aqui era temporario na tabela pedidos e abre a tela de produtos
        db.addPedido(pedido, (res)=>{
            if(res.error){
                M.toast({html:res.message})
            }else{
                M.toast({ html: 'Pedido iniciado' })
                model.openPage('produtos')
                M.toast({ html: 'Insira os produtos' })
            }
        })  
    },

    abrePedido: (pedidoId)=>{
        model.loading('open')

        db.getPedido(pedidoId, (res)=>{
            if(res){
                localStorage.setItem('pedido',JSON.stringify(res))
                model.listaProdutosPedido(res)
                model.loading('close')
            }else{
                M.toast({html:'Pedido não encontrato'})
                model.loading('close')
            }
        })
    },

    listaProdutosPedido: (data)=>{

        $('#pedido .pedido-total').html(data.TOTAL)
        $('#pedido .pedido-itens').html(data.NUM_ITEMS)

        db.listaProdutosPedido(data.PEDIDO_ID, (res)=>{
             
            if(res.total_rows > 0){
                view.pedido(res.rows)
                model.loading('close')
            }else{
                view.pedido(false)
                model.loading('close')
            }
        })

    },
    
    buscaProduto: ()=>{
        
        model.loading('open')

        let params = $('form#busca-produto').serializeJSON()

        if ($('#filters').is(':visible')) {
            $('#filters').addClass('hidden')
        }

        db.getProduto(params, (res) => {

            if (res.total_rows > 0) {
                view.listaProdutos(res.rows)
            } else {
                M.toast({ html: 'Nenhum produto encontrado' })
            }

            model.loading('close')
        })
    },

    addProdutoPedido: (data) => {
        
        let pedido = JSON.parse(localStorage.getItem('pedido'))

        let produto = JSON.parse(decodeURIComponent(data))
        
        //verifica se o produto esta na lista do pedido
        const existe = $('#lista-produtos-pedido').find('[data-produto-id='+produto.CODIGO+']')

        if (existe.length > 0){
            
            let el = $('[data-produto-id=' + produto.CODIGO + ']')

            model.openPage('pedido')
            
            el.addClass('pulse red lighten-4')

            setTimeout(()=>{
                el.removeClass('pulse red lighten-4')
            },8000)

            $('.page').animate({
                scrollTop: el.offset().top - 70
            }, 800);

            M.toast({html:'O produto já está na lista'})
            return
        }
                
        let saveProduto = {}
        //montanod objeto produtoPedido
        saveProduto.s = produto
        saveProduto.PEDIDO_ID  = pedido.PEDIDO_ID
        saveProduto.PRODUTO_COD = produto.CODIGO
        saveProduto.QTD = 1
        saveProduto.PRECO_VENDA_PRODUTO = produto.PRECO_VENDA_PRODUTO
        saveProduto.SUBTOTAL = produto.PRECO_VENDA_PRODUTO
        
        db.addProdutoPedido(saveProduto,(res)=>{
            if(res.error){
                M.toast({html:res.message})
            }else{
                 
                model.updatePedidoTotais((res) => {
                    if (res) {
                        model.openPage('pedido')
                    }
                })
                M.toast({html:'Produto adicionado'})
            }
        })
    },

    updateProdutoPedido: (data)=>{
         
        var produtoKey = String(data.produtoKey)
        var type = data.action

        switch (type) {
            case 'delete':
                model.deleteProdutoPedido(produtoKey)
                break;
            case 'sum':
                model.sumProduto(produtoKey)
                break;
            case 'minus':
                model.minusProduto(produtoKey)
                break;
            case 'save':
                model.saveProdutoPedido(data)
            default:
                break;
        }

    },

    deleteProdutoPedido: (produtoKey) => {
        
        navigator.notification.confirm('Você tem certeza?', (res)=>{

            if(res == 1){

                db.removeProdutoPedido(produtoKey, (res) => {

                    if (res.error) {
                        console.log(res.message)
                    } else {

                        model.updatePedidoTotais((res) => {
                            if (res) {
                                model.openPage('pedido')
                            }
                        })
                    }
                })
                

            } 

        },'Deletar item', ['Sim','Cancelar'])
        
    },

    saveProdutoPedido: (params)=>{
        
        db.updateProdutoPedido(params, (res) => {

            if (res.error) {

            } else {

                model.updatePedidoTotais((res) => {
                    if (res) {
                        model.openPage('pedido')
                    }
                })

            }
        })
        
    },

    sumProduto: (produtoKey) => {

        db.somaProdutoPedido(produtoKey, (res)=>{
             
             if(res.error){

             }else{

                 model.updatePedidoTotais((res) => {
                     if (res) {
                         model.openPage('pedido')
                     }
                 })
             }
        })
        
    },

    minusProduto: (produtoKey) => {
        db.subtraiProdutoPedido(produtoKey, (res) => {

            if (res.error) {

            } else {

                model.updatePedidoTotais((res)=>{
                    if(res){
                        model.openPage('pedido')
                    }
                })
                

            }
        })
    },

    updatePedidoTotais: (callback) => {
        const pedido = JSON.parse(localStorage.getItem('pedido'))

        //traz produtos do pedido
        db.listaProdutosPedido(pedido.PEDIDO_ID, (res)=>{
            
            let items = res.total_rows

            var prom = new Promise((resolve, reject) => {
                let total = 0
                res.rows.forEach((i, k) => {
                     
                    total = Number(i.doc.SUBTOTAL) + Number(total)
                    if(k == items - 1){
                         
                      resolve(total)
                    }
                })
            })

            prom.then((total)=>{

                total = Number(total)
                
                pedido.TOTAL = parseFloat(total.toFixed(2))
                pedido.NUM_ITEMS = items 
                
                db.updatePedido(pedido, (res)=>{
                    if(res.error){
                        M.toast({html:res.message})
                        callback(false)
                    }else{
                        localStorage.setItem('pedido', JSON.stringify(res.data))
                        callback(true)
                    }
                })
            })
 
        })
       
    },

    verProduto: (data)=>{
        let produto = JSON.parse(decodeURIComponent(data))
      
        view.produto(produto)
        model.openPage('produto')
    },

    
    notaStatus: (status)=>{

        let pedido = JSON.parse(localStorage.getItem('pedido'))

        pedido.NOTA_FISCAL = status

        db.updatePedido(pedido, (res) => {
            if (res.error) {
                M.toast({ html: res.message })
            } else {
                localStorage.setItem('pedido', JSON.stringify(res.data))
            }
        })
    },

    fecharPedido: ()=>{
        
        navigator.notification.confirm('Você tem certeza?', (res) => {

            if (res == 1) {

                console.log('FECHANDO PEDIDO')

                model.loading('open')
                let pedido = JSON.parse(localStorage.getItem('pedido'))

                pedido.PEDIDO_STATUS = 'FECHADO'
 
                db.updatePedido(pedido, (res) => {
                    if (res.error) {
                        model.loading('close')
                        M.toast({ html: res.message })
                    } else {
                        model.loading('close')
                        M.toast({ html: 'Pedido fechado' })
                        localStorage.setItem('pedido',null)
                        model.openPage('pedidos')
                    }
                })
            }

        }, 'Fechar pedido', ['Sim', 'Cancelar'])

    },

    excluiPedido: ()=>{

        navigator.notification.confirm('Você tem certeza?', (res) => {

            if (res == 1) {

                let pedido = JSON.parse(localStorage.getItem('pedido'))

                db.excluirPedido(pedido.PEDIDO_ID, (res) => {

                    if (res.error) {
                        console.log(res.message)
                        M.toast({ html: res.message })
                    } else {
                        model.openPage('pedidos')
                    }
                })
            }

        }, 'Excluir pedido', ['Sim', 'Cancelar'])
    },

    

    syncPedidos: ()=>{
        db.pedidosFechados((res) => {

            if (res.total_rows > 0) {

                res.rows.forEach((i, k) => {

                    db.listaProdutosPedido(i.id, (rs) => {

                        i.doc.PRODUTOS = rs.rows
                        delete i.doc.s

                        model.sendServerPedidos(i.doc)
                    })
                })


            }
        })
    },

    sendServerPedidos: (i) => {
        model.ajax('post','sync?empresaCnpj='+ localStorage.getItem('empresaCnpj'), i, (res)=>{
            
            if(res.error){
                console.log(res)
            }else{
                console.log(res)
            }
        })
    },

    limpaBase: ()=>{
        
        var inputs = $('#limpabase form').serializeJSON()

        if(inputs.senha == ''){
            model.cAlert('Digite sua senha', 'error', 1500)
            return
        }

        if (inputs.senha != 85460022) {

            model.cAlert('Senha incorreta', 'error', 1500)
            return
        }

        navigator.notification.confirm('Processo irreverssível. Tem certeza?', function(confirm){

            if(confirm == 1){
                                    
                model.loading('open')
                db.limpaBase(function(res){
                    if(res.error){
                        model.loading('close')
                        model.cAlert(res.message, 'error', 1800, true)
                         
                    }else{
                        model.loading('close')
                        model.cAlert(res.message, 'success', 1800)
                        location.reload(); 
                    }
                })
            } 
            
            $('#limpabase').modal('hide')
             
        })
    }
     
}