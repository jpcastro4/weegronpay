var view = {

    listaClientes: function(clientes){
        $('#lista-clientes').html('')
        clientes.forEach((r,k)=>{
            
            $('#lista-clientes').append('<div class="row mb-0 addCliente" data-cliente="' + encodeURIComponent(JSON.stringify(r.doc))+'">'+
                '<div class= "col s10" >'+
                '<div class="row mb-0 item-head">'+
                    '<div class="col s12">'+r.doc.NOME+'</div>'+
                '</div>'+
                '<div class="row mb-0">'+
                    '<div class="col s3">'+
                        '<span>COD</span>'+
                    '</div>'+
                    '<div class="col s9">'+
                        '<span>CNPJ</span>'+
                    '</div>'+
                    '<div class="col s3">'+
                    '<span class="codCliente">'+r.doc.CODIGO+'</span>' +
                    '</div>' +

                    '<div class="col s9">' +
                    '<span class="cnpjCliente truncate">'+r.doc.CNPJ_CPF+'</span>' +
                    '</div>' +
                    '</div>' +
                    '</div >' +
                    '<div class="col s2 valign-wrapper">'+
                    '<i class="material-icons teal darken-1 item-icon">chevron_right</i>'+
                '</div>'+
                '<hr class="divisor col s12" tabindex="-1" >'+
               '</div>')
        })
    },

    pedidosAbertos: (pedidos)=>{

        if(pedidos == false){
            $('#lista-pedidos-abertos').html('<div class="col s12"><div class="alert alert-info center-align">Nenhum pedido aberto</div></div>')
        }else{
            $('#lista-pedidos-abertos').html('')

            pedidos.forEach((r, k) => {

                $('#lista-pedidos-abertos').append('<div class= "col s12 abrePedido" data-pedido="' + r.doc.PEDIDO_ID +'">' +
                    '<div class="row mb-0 item py-2" >' +
                    '<div class="col s10">' +
                    '<div class="row mb-0 item-head">' +
                    '<div class="col s6">PEDIDO</div>' +
                    '<div class="col s6">' + r.doc.PEDIDO_ID + '</div>' +
                    '</div>' +
                    '<div class="row mb-0">' +
                    '<div class="col s2">' +
                    '<span>COD</span>' +
                    '</div>' +
                    '<div class="col s5">' +
                    '<span>Cliente</span>' +
                    '</div>' +
                    '<div class="col s5">' +
                    '<span>CNPJ</span>' +
                    '</div>' +
                    '<div class="col s2">' +
                    '<span class="codCliente">' + r.doc.CLIENTE_COD + '</span>' +
                    '</div>' +
                    '<div class="col s5">' +
                    '<span class="nomeCliente truncate">' + r.doc.s.NOME + '</span>' +
                    '</div>' +
                    '<div class="col s5">' +
                    '<span class="cnpjCliente truncate">' + r.doc.s.CNPJ_CPF + '</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="col s2 valign-wrapper">' +
                    '<i class="material-icons teal darken-1 item-icon">add</i>' +
                    '</div>' +
                    '<hr class="divisor col mt-1 mb-0 s12" tabindex="-1">' +
                    '</div>' +
                    '</div>')
            })
        }
        
    },

    pedidosFechados: (pedidos) => {

        if (pedidos == false) {
            $('#lista-pedidos-fechados').html('<div class="col s12"><div class="alert alert-info center-align">Nenhum pedido fechado</div></div>')
        } else {
            $('#lista-pedidos-fechados').html('')

            pedidos.forEach((r, k) => {

                $('#lista-pedidos-fechados').prepend('<div class= "col s12">' +
                    '<div class="row mb-0 item py-2" >' +
                    '<div class="col s10">' +
                    '<div class="row mb-0 item-head">' +
                    '<div class="col s6">PEDIDO</div>' +
                    '<div class="col s6">' + r.doc.PEDIDO_ID + '</div>' +
                    '</div>' +
                    '<div class="row mb-0">' +
                    '<div class="col s2">' +
                    '<span>COD</span>' +
                    '</div>' +
                    '<div class="col s5">' +
                    '<span>Cliente</span>' +
                    '</div>' +
                    '<div class="col s5">' +
                    '<span>CNPJ</span>' +
                    '</div>' +
                    '<div class="col s2">' +
                    '<span class="codCliente">' + r.doc.CLIENTE_COD + '</span>' +
                    '</div>' +
                    '<div class="col s5">' +
                    '<span class="nomeCliente truncate">' + r.doc.s.NOME + '</span>' +
                    '</div>' +
                    '<div class="col s5">' +
                    '<span class="cnpjCliente truncate">' + r.doc.s.CNPJ_CPF + '</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="col s2 valign-wrapper">' +
                    '<i class="material-icons teal darken-1 item-icon">add</i>' +
                    '</div>' +
                    '<hr class="divisor col mt-1 mb-0 s12" tabindex="-1">' +
                    '</div>' +
                    '</div>')
            })
        }

    },

    pedido: (produtos)=>{

        if (produtos == false) {
            $('#lista-produtos-pedido').html('<div class="col s12"><div class="alert alert-info center-align">Adicione produtos ao pedido</div></div>')
        } else {
            
            $('#lista-produtos-pedido').html('')

            produtos.forEach((r, k) => {

                $('#lista-produtos-pedido').prepend('<div class="col s12 py-2" data-produto-key="' + r.id + '"  data-produto-id="' + r.doc.PRODUTO_COD + '" data-produto="' + encodeURIComponent(JSON.stringify(r.doc)) +'">'+
                    '<div class= "row mb-0" >' +
                    '<div class="col s2">' +
                    '<img src="img/produto.png" width="50" height="50" />' +
                    '</div>' +
                    '<div class="col s8">' +
                    '<div class="row mb-0">' +
                    '<div class="col s12">' +
                    '<span>COD </span>' +
                    '<span class="codCliente">' + r.doc.PRODUTO_COD +'</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="row mb-0 item-head">' +
                    '<div class="col s12 descricao">' + r.doc.s.DESCRICAO_PRODUTO +'</div>' +
                    '<div class="col s12 ">' +
                    '<span data-badge-caption="UNID" class="badge blue white-text">' + r.doc.QTD +'</span><span class="badge aux">X</span>' +
                    '<span data-badge-caption="" class="badge blue white-text">' + r.doc.PRECO_VENDA_PRODUTO +'</span><span class="badge aux">=</span>' +
                    '<span data-badge-caption="" class="badge blue white-text">' + r.doc.SUBTOTAL +'</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="col s2 valign-wrapper">' +
                    '<div class="row mb-0">' +
                    '<div class="col s12"><i class="material-icons pedido-icon grey-text py-1" data-update="sum" >add_circle</i></div>' +
                    '<div class="col s12"><i class="material-icons pedido-icon grey-text py-1"  data-update="minus" >remove_circle</i></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<hr class="divisor col s12 my-1" tabindex="-1">' +
                    '</div >')
            })
        }
    },

    listaProdutos: (produtos)=>{

        if (produtos == false) {
             $('#lista-produtos').html('<div class="col s12 center-align"><div class="alert alert-danger center-align">Nenhum produto encontrado</div></div>')

            //$('#lista-produtos').html('<div class="col s12 center-align"><img width="60" src="img/product.png" ></div>')
        } else {

            $('#lista-produtos').html('')

            produtos.forEach((r, k) => {

                $('#lista-produtos').append('<div class="col s12" data-produto="' + encodeURIComponent(JSON.stringify(r.doc)) + '">' +
                    '<div class= "row mb-0" >' +
                    '<div class="col s2">' +
                    '<img src="img/produto.png" width="50" height="50" />' +
                    '</div>' +
                    '<div class="col s8">' +
                    '<div class="row mb-0">' +
                    '<div class="col s12">' +
                    '<span>COD </span>' +
                    '<span class="codCliente">'+r.doc.CODIGO+'</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="row mb-0 item-head">' +
                    '<div class="col s12">' + r.doc.DESCRICAO_PRODUTO +'</div>' +
                    '<div class="col s12 ">' +
                    '<span data-badge-left-caption="R$" class="badge blue white-text">' + r.doc.PRECO_VENDA_PRODUTO +'</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="col s2 valign-wrapper">' +
                    '<i class="material-icons pedido-icon">add_circle</i></div>' +
                    '</div>' +
                    '<hr class="divisor col s12 my-1" tabindex="-1">' +
                    '</div>' +
                    '</div >')
            })
        }

    },

    produto: (data)=>{
         
        $('#view-produto').html('')
        $('#view-produto').append('<div class="card" data-produto="'+ encodeURIComponent(JSON.stringify(data)) +'">'+
            '<div class="card-image"><img width="100%" src="img/produtos.png" ></div >'+
            '<div class="card-content" > '+
                '<span class="card-title grey-text text-darken-4">' + data.s.DESCRICAO_PRODUTO+'</span>'+
                '<div class="row">' +
                    '<div class="col s6">' +
                        '<label for="last_name">Preço unitário</label></br>' +
                        '<span>' + data.PRECO_VENDA_PRODUTO + '</span>' +
                    '</div>' +
                    '<div class="col s6">'+
                        '<label for="last_name">Subtotal</label></br>' +
                        '<span>' + data.SUBTOTAL + '</span>' +
                    '</div>'+
                '</div>'+
                '<div class="row">' +
                    '<div class="input-field col s6">' +
                        '<input id="qtd" type="number" name="QTD" class="validate" value="' + data.QTD + '" >' +
                        '<label for="qtd" class="active">Quantidade</label>' +
                    '</div>' +
                '</div>' +
            '</div> '+
            '<div class="card-action"> '+
                '<a href="#" id="exluir-produto" data-update="delete" > Excluir </a>'+
                '<a href="#" id="salvar-produto" data-update="save" > Salvar </a>' +
            '</div >'+
            '</div>')

    } 

}