let localDb = null
let historico = []
let registrationID = null //localStorage.getItem('registrationId')
let deviceID = null //localStorage.getItem('deviceID')

//const pluralize = (count, noun, sSuffix = '', pSuffix = 's') => (count != 1) ? noun + pSuffix : noun + sSuffix

var app = {
    // APP CONSTRUCTOR
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('hidekeyboard', this.onKeyboardHide, false);
        document.addEventListener('showkeyboard', this.onKeyboardShow, false);
        document.addEventListener("online", this.online, false);
        document.addEventListener("backbutton", this.onBackKeyDown, false);
    },
    initialize: function () {
        this.bindEvents()         
    },
    onDeviceReady: function () {
        db.initBD()
        
        var attachFastClick = Origami.fastclick
        attachFastClick(document.body)

        if (device.available){

            //inicliza de acordo com a plataforma
            if (device.platform == 'browser') {
                localStorage.setItem('homologaStatus', 2)
                localStorage.setItem('empresaCnpj','14926394000118')
                localStorage.setItem('dispId','15')
                deviceID = '711C3126-FF51-4B07-958B-FD30182BA043' //localStorage.setItem('deviceID', '711C3126-FF51-4B07-958B-FD30182BA043')
            }

            if (device.platform == 'Android') {
                deviceID = device.uuid //localStorage.setItem('deviceID', device.uuid)
            }

            localStorage.setItem('registrationId', false)
            app.setupPush()
            app.initializeEls()
            model.initTelas()
            controller.initPages() 
        }
        

    
        // if (device.available) {

        //     //inicializa o banco de dados

        //     db.init()

        //     //inicializa permissoes de localizacao
        //     // var localizacao = navigator.geolocation.getCurrentPosition(
        //     //     function(position){
        //     //         //console.log(position.coords)
        //     //         // if(position.coords == '' || !position.coords ){
        //     //         //     api.cAlert('Erro na localização','error',5000)           
        //     //         // }           
        //     //     },
        //     //     function(error){
        //     //         $('.infopage .gps').html('GPS offline')
        //     //         model.loading('open')
        //     //     },
        //     //     // {maximumAge:60000, timeout:4000, enableHighAccuracy:true}
        //     //     {enableHighAccuracy:true}
        //     // )

        //     //inicializa monitoramente de localização permanente
        //     init.localizacao()
        // }        
    },
    initializeEls: function () {
        
        //M.AutoInit();

        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.fixed-action-btn');
            var instances = M.FloatingActionButton.init(elems);
        });

        $('html,body').on('click', (e)=>{
            
            if ($(e.target).find('.dropdown-content').is(':visible')) {
                $(".dropdown-content").hide().css('opacity', '0')
            }
        });

        $('.dropdown-content').on('click',function (e) {
            e.stopPropagation();
        });
                        
        $('.dropdown-trigger').on('click', (e)=>{          
            e.preventDefault()

            var $dt = $(e.currentTarget).data('target')
            var prt = $('#' + $dt)
            
            if (!prt.is(':visible')){
                prt.show().fadeIn().css('opacity', '1') 
                //prt.hide().fadeOut().css('opacity', '0')
            }else{
                
            }

        })
        
        $('.openPage').on('click', function(e){
            e.preventDefault()
            model.openPage(e.currentTarget.dataset.target)
        })

        $('#form-homologa').on('submit', function(e){
            e.preventDefault();
            model.homologa()   
        })

        $('#form-login').on('submit', (e)=>{
            e.preventDefault()
            model.login()
        })

        $('#sair').on('click', (e) => {
            e.preventDefault()
            model.sair()
        })

        $('#novo-pedido').on('click', (e)=>{
            e.preventDefault()
            model.novoPedido()
        })

        $('form#busca-cliente').on('submit',(e)=>{
            e.preventDefault()
            model.buscaCliente()
        })

        $('#abrir-filtros-clientes').on('click', ()=>{
            let filters = $('#filtros-clientes')
            if (filters.is(':visible')){
                filters.addClass('hidden')
            }else{
                filters.removeClass('hidden')
            }
        })

        $('form#busca-cliente input[name=s]').on('focus', (e) => {
            let filters = $('#filtros-clientes')
            if (filters.is(':visible')) {
                filters.addClass('hidden')
            }
        })

        $('#clientes').on('click','.addCliente', (e)=>{
            const cliente = e.currentTarget.dataset.cliente
            model.addClientePedido(cliente)
        })

        $('#pedidos').on('click','[data-pedido]', (e)=>{
            const pedidoId = e.currentTarget.dataset.pedido
            model.abrePedido(String(pedidoId))
            model.openPage('pedido')
        })

        $('#add-produto').on('click', (e)=>{
            e.preventDefault()
            model.openPage('produtos')
        })

        $('form#busca-produto').on('submit', (e) => {
            e.preventDefault()
            model.buscaProduto()
        })

        $('#abrir-fitros-produtos').on('click', () => {
            let filters = $('#filtros-produtos')
            if (filters.is(':visible')) {
                filters.addClass('hidden')
            } else {
                filters.removeClass('hidden')
            }
        })

        $('form#busca-produto input[name=s]').on('focus', (e) => {
            let filters = $('#filtros-produtos')
            if (filters.is(':visible')) {
                filters.addClass('hidden')
            }
        })

        $('#abrir-leitor').on('click', (e)=>{

            if (!$(e.currentTarget).hasClass('active')){

                $('#abrir-leitor').addClass('active blue-text pulse')        
                $('form#busca-produto [name=filtro][value=DESCRICAO_PRODUTO]').removeAttr('checked')
                $('form#busca-produto [name=filtro][value=CODIGO_BARRA_PRODUTO]').attr('checked', 'checked')
                
                cordova.plugins.barcodeScanner.scan(
                    function (result) {

                        $('form#busca-produto [name=s]').val(result.text)
                        
                        model.buscaProduto()

                        // alert("We got a barcode\n" +
                        //     "Result: " + result.text + "\n" +
                        //     "Format: " + result.format + "\n" +
                        //     "Cancelled: " + result.cancelled);
                    },
                    function (error) {
                         
                        //model.buscaProduto()
                    },
                    {
                        preferFrontCamera: false, // iOS and Android
                        showFlipCameraButton: true, // iOS and Android
                        showTorchButton: true, // iOS and Android
                        torchOn: true, // Android, launch with the torch switched on (if available)
                        saveHistory: false, // Android, save scan history (default false)
                        prompt: "Aponte o leitor", // Android
                        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                        formats: "EAN_13", // default: all but PDF_417 and RSS_EXPANDED
                        orientation: "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                        disableAnimations: true, // iOS
                        disableSuccessBeep: false // iOS and Android
                    }
                )
            } else {
                $('#abrir-leitor').removeClass('active blue-text pulse')
                $('form#busca-produto [name=filtro][value=CODIGO_BARRA_PRODUTO]').removeAttr('checked')
                $('form#busca-produto [name=filtro][value=DESCRICAO_PRODUTO]').attr('checked', 'checked')
            }
        })

        $('#produtos').on('click', '[data-produto]',(e)=>{
            const produto = e.currentTarget.dataset.produto
            model.addProdutoPedido(produto)
        })

        $('#pedido').on('click','[data-update]', (e)=>{
                            
            let params = {
                action: $(e.target).data('update'),
                produtoKey: $(e.target).parents('[data-produto-key]').data('produto-key')
            }
                        
            model.updateProdutoPedido(params)
        })

        $('#pedido').on('click','[data-produto] .descricao', (e)=>{

            var produto = $(e.currentTarget).parents('[data-produto]').data('produto')

            model.verProduto(produto)
        })

        $('#produto').on('click', '[data-update]', (e)=>{

            e.preventDefault()
            
            let params = {
                action: $(e.target).data('update'),
                produtoKey: JSON.parse(decodeURIComponent($(e.target).parents('[data-produto]').data('produto')))._id,
                qtd: $(e.target).parents('[data-produto]').find('input[name=QTD]').val()
            }

            model.updateProdutoPedido(params)
        })

        $('#nota-fiscal').on('click', (e)=>{
            let $thisEl = e.target
            model.notaStatus($($thisEl).is(':checked'))
        })
        
        $('#fechar-pedido').on('click', (e)=>{
            e.preventDefault()
 
            model.fecharPedido()
        })

        $('#excluir-pedido').on('click', (e)=>{
            e.preventDefault()
            model.excluiPedido()
        })

        $('#sync').on('click', (e)=>{
            e.preventDefault()
            model.syncPedidos()
        })
 
    },
    setupPush: function () {
        
        var push = PushNotification.init({
            "android": {
            },
            "browser": {},
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            },
            "windows": {}
        });
        
        push.on('registration', function (data) {

            console.log('RECUPERANDO PUSH ID')

            if (localStorage.getItem('registrationId') != undefined ){

                if (localStorage.getItem('registrationId') != data.registrationId){
                    
                    localStorage.setItem('registrationId', data.registrationId)
                    console.log('TROCANDO PUSH ID')
                    model.refreshToken(data.registrationId)
                }
            }else{
                console.log('INSERINDO PRIMEIRO PUSH ID')
                localStorage.setItem('registrationId', data.registrationId )
                model.refreshToken(data.registrationId)
            }
            
            console.log('PUSH: ' + data.registrationId);

        });

        push.on('error', function (e) {
            M.toast({ html: e.message})
            alert(e.message)
            console.log("push error = " + e.message);
        });

        push.on('notification', function (data) {
            
            model.executePush(data)
 
        });
    },
    onKeyboardShow: ()=>{

        $('.keyboard').addClass('active')
    },
    onKeyboardHide: () => {

        $('.keyboard').removeClass('active')
    },
    onBackKeyDown: ()=>{

        if (historico.length > 0) {
            if (historico.length == 1) {
                var back = 'pedidos'
            }
            if (historico.length == 2) {
                var back = historico[0]
            }
            if (historico.length >= 3) {
                var back = historico[historico.length - 2]
            }
            model.openPage(back, true)
            historico.pop()
        } else {
            model.openPage('pedidos', true)
        }

    },
    online: ()=>{

        console.log('ONLINE')
    }

}


var init = {
    
    localizacao: ()=>{
        model.loading('open')
        $('#loading .log').text('Buscando GPS')
        var watchID = navigator.geolocation.watchPosition(
            function (position) {
                //console.log(position.coords)
                if (position.coords.longitude == 'undefined') {
                    $('#loading .info').text('Calibrando GPS')
                    $('.infopage .gps').html('Calibrando GPS')
                    model.loading('open')
                } else {
                    $('#loading .log').text('Inicializando')
                    model.loading('close')
                    localStorage.setItem('deviceLocation', position.coords.latitude + ',' + position.coords.longitude)
                    $('.infopage .gps').html('Lat: ' + position.coords.latitude + ', Long: ' + position.coords.longitude)
                }
            },
            function (e) {
                if (e) {

                    
                    if (e.code == 1) {
                        model.loading('open')
                        $('#loading .log').text('GPS não autorizado')
                        $('.infopage .gps').html('GPS não autorizado')
                    }

                    if (e.code == 2) {
                        model.loading('open')
                        $('#loading .log').text('Localizacao não recuperada')
                        $('.infopage .gps').html('Localizacao não recuperada')
                    }

                    if (e.code == 3) {
                       // $('#loading .log').text('Recalibrando GPS')
                        $('.infopage .gps').html('Recalibrando GPS')
                    }
                    
                }
            },
            { enableHighAccuracy: true, timeout: 5000, }
        )

        $('.infopage').prepend('<li class="list-group-item"> Autorização de Localização: ' + watchID + '</li>')
    },
   
    back: (active)=>{

        if(active == true){
            $(document).on('keydown', function (e) {
                if (e.keyCode == 37) {
                    init.onBackKeyDown()
                }
            })
        }else{
            $(document).on('keydown', function (e) {
                if (e.keyCode == 37) {
                     return false
                }
            })
            
        }
    }
     
          
}

