var controller = {
    
    initPages: function () {
        if ($('.page#homologacao').is(':visible')) {
            controller.pageHomologacao()
        }

        if ($('.page#login').is(':visible')) {
            controller.pageLogin()
        }

        if ($('.page#pedidos').is(':visible')) {
            controller.pagePedidos()
        }

        if ($('.page#pedido').is(':visible')) {
            controller.pagePedido()
        }

        if ($('.page#produto').is(':visible')) {
            this.pageProduto()
        }

        if($('.page#clientes').is(':visible')){
            controller.pageClientes()
        }
        if ($('.page#produtos').is(':visible')) {
            this.pageProdutos()
        }        
    },

    pageHomologacao: function(){
         
        //model.initTelas()
        
    },

    pageLogin: ()=>{

        $('.page#login').find('input[name=ID]').attr('autofocus')
        
        if (localStorage.getItem('user_log') == 'true'){  
            model.openPage('pedidos')
        } 
    },

    pagePedidos: ()=>{

        $('.tab-pedidos').tabs({
            swipeable: true
        })

        model.pagePedidos()
        model.loading('close')
    },
    pagePedido: ()=>{

        console.log(JSON.parse(localStorage.getItem('pedido')))
        model.abrePedido(JSON.parse(localStorage.getItem('pedido')).PEDIDO_ID)
                 
    },

    pageClientes: ()=>{

        $('.page#clientes').find('[name="s"]').focus()
        
    },

    pageProdutos: ()=>{
        $('.page#produtos').find('[name="s"]').focus()

        if ($('form#busca-produto [name=filtro][value=CODIGO_BARRA_PRODUTO]').prop('checked') ){
            $('#abrir-leitor').addClass('blue pulse')
        }else{
            $('#abrir-leitor').removeClass('blue pulse')
        }
    },

    pageProduto: ()=>{
        $('.page#produto').find('input[name=QTD]').focus()
    },
     
    sync: function(){
        model.openPage('sync',false,close)
    },
    info: function(){
        model.openPage('info')
    },
    opcoes: function () {
        model.openPage('opcoes')
    },
    sair: function () {
        model.sair()
    }	 

	
}