let deviceDb
let representantesDb
let clientesDb
let produtosDb
let pedidosDb
let pedidosProdutosDb

var db = {

    initBD: ()=>{

        representantesDb = new PouchDB('Representantes')
        clientesDb = new PouchDB('Clientes')
        produtosDb = new PouchDB('Produtos')
        pedidosDb = new PouchDB('Pedidos')
        pedidosProdutosDb = new PouchDB('Pedidos_Produtos')
        
    },

    syncTables: function(tables){
        
        if(tables.representantes){
            db.syncRepresentantes(tables.representantes)           
        }

        if (tables.clientes) {
            db.syncClientes(tables.clientes)            
        }

        if (tables.produtos) {         
            db.syncProdutos(tables.produtos)
        }
    },

    syncRepresentantes: (representantes)=>{

        representantesDb = new PouchDB('Representantes');

        var prom = new Promise( (resolve, reject)=>{

            representantesDb.allDocs().then((res) => {
                if (res.total_rows > 0) {
                   
                    representantesDb.destroy().then(function (response) {
                        representantesDb = new PouchDB('Representantes');
                        resolve()
                    })


                }else{                    
                    resolve()
                }
            })
            .catch(function (err) {
                console.log(err)
                reject()
            });
        })

        prom.then( ()=>{

            representantes.forEach(function (t, k) {
                t._id = t.CODIGO
            })

            representantesDb.bulkDocs(representantes)
                .then(function (result) {
                    console.log('Representantes sincronizados')
                }).catch(function (err) {
                    console.log(err);
                });
        })
    },

    syncClientes: (clientes)=>{

        clientesDb = new PouchDB('Clientes');

        var prom = new Promise( (resolve, reject)=>{
            clientesDb.allDocs().then((res) => {
                if (res.total_rows > 0) {

                    clientesDb.search({
                        fields: ['DESCRICAO_PRODUTO', 'CODIGO','CODIGO_BARRA_PRODUTO'],
                        destroy: true
                    })

                    clientesDb.destroy().then(function (response) {
                        clientesDb = new PouchDB('Clientes');
                        resolve()
                    })
                } else {
                    resolve()
                }
            })
            .catch(function (err) {
                console.log(err)
                reject()
            });

        })

         
        prom.then(()=>{
            
            clientes.forEach(function (t, k) {
                t._id = t.CODIGO
            })

            clientesDb.bulkDocs(clientes)
                .then(function (result) {
                    console.log('Clientes sincronizados')
                }).catch(function (err) {
                    console.log(err);
                });
        })
    },

    syncProdutos: (produtos) => {

        produtosDb = new PouchDB('Produtos');

        var prom = new Promise((resolve,reject)=>{

            produtosDb.allDocs().then((res)=>{
                if(res.total_rows > 0){

                    produtosDb.search({
                        fields: ['NOME', 'CODIGO', 'CNPJ_CPF'],
                        destroy: true
                    })

                    produtosDb.destroy().then(function (response) {
                        produtosDb = new PouchDB('Produtos');
                        resolve()
                    })

                }else{
                    resolve()
                }
            })
            .catch(function (err) {
                console.log(err)
                reject()
            });
        })

        prom.then(()=>{
            
            produtos.forEach(function (t, k) {
                t._id = t.CODIGO
                t.PRECO_VENDA_PRODUTO = t.PRECO_VENDA_PRODUTO.replace(',', '.')
            })

            produtosDb.bulkDocs(produtos)
                .then(function (result) {
                    console.log('Produtos sincronizados')
                }).catch(function (err) {
                    console.log(err);
                });

        })
        
    },

    login: (dados, callback)=>{

        representantesDb.get(dados.ID).then(function (doc) {
            
            if(doc.SENHA == dados.SENHA){
                doc.SENHA = ''
                localStorage.setItem('user_log',JSON.stringify(doc))
                return callback({error:false})
            }else{
                return callback({ error: true, message: 'Senha incorreta' })
            }

        }).catch(function (err) {
            console.log(err);

            return callback({ error: true, message: err })
        });
    },

    pedidosAbertos: (callback) => {

        pedidosDb.search({
            query: 'ABERTO',
            fields: ['PEDIDO_STATUS'],
            include_docs: true,
        }).then(function (res) {
            callback(res)
        }).catch(function (err) {
            callback(err)
        })
    },

    pedidosFechados: (callback) => {

        pedidosDb.search({
            query: 'FECHADO',
            fields: ['PEDIDO_STATUS'],
            include_docs: true,
        }).then(function (res) {
            callback(res)
        }).catch(function (err) {
            callback(err)
        })
    },

    getCliente: (params,callback)=>{
      
        clientesDb.search({
            query: params.s,
            fields: [params.filtro],
            include_docs: true,
        }).then(function (res) {
            callback(res)
        }).catch(function (err) {
            callback(err)
        })
    },

    getProduto: (params, callback) => {

        produtosDb.search({
            query: params.s,
            fields: [params.filtro],
            include_docs: true,
        }).then(function (res) {
            callback(res)
        }).catch(function (err) {
            callback(err)
            console.log(err)
        })
    },

    getPedido: (pedidoId, callback) => {
        pedidoId = String(pedidoId)
        pedidosDb.get(pedidoId)
        .then(function (doc) {
            callback(doc)
        }).catch(function (err) {
            console.log(err)
        })
    },

    listaProdutosPedido: (pedidoId, callback)=>{     

        pedidosProdutosDb.search({
            query: pedidoId,
            fields:['PEDIDO_ID'],
            include_docs: true
        }).then((res)=>{
            callback(res)
        }).catch( (err)=>{
            console.log(err)
        })
    },

    addPedido: (params, callback)=>{

        params._id = String(params.PEDIDO_ID)

        pedidosDb.put(params)
        .then(function (response) {
            return callback({error:false})
        }).catch(function(err) {
            console.log(err)
            return callback({ error: true, message: err })
        });
    },

    addProdutoPedido: (params, callback)=>{
        
        params._id = String($.now())
 
        pedidosProdutosDb.put(params)
        .then((res)=>{
            return callback({ error: false })
        }).catch((err)=>{
            console.log(err)
            return callback({ error: true, message: err })
        })

    },

    updateProdutoPedido: (params, callback)=>{

        pedidosProdutosDb.get(params.produtoKey)
            .then(function (doc) {

                doc.QTD = params.qtd
                doc.SUBTOTAL = params.qtd * doc.PRECO_VENDA_PRODUTO

                doc.SUBTOTAL = parseFloat(doc.SUBTOTAL.toFixed(2));
                 
                return pedidosProdutosDb.put(doc).then((res) => {
                    callback({ error: false })
                });

            }).catch(function (err) {
                console.log(err)
                callback({ erro: true, message: err })
            })

    },

    somaProdutoPedido: (produtoKey, callback)=>{

        pedidosProdutosDb.get(produtoKey)
            .then(function (doc) {

                doc.QTD = Number(doc.QTD) +1
                doc.SUBTOTAL = doc.QTD * doc.PRECO_VENDA_PRODUTO

                doc.SUBTOTAL = parseFloat(doc.SUBTOTAL.toFixed(2));
                // doc._id = produtoKey
                // doc._rev = doc._rev

                return pedidosProdutosDb.put(doc).then((res)=>{
                    callback({ error: false })
                });
                
            }).catch(function (err) {
                console.log(err)
                callback({ erro: true,message:err })
            })
    },

    subtraiProdutoPedido: (produtoKey, callback) => {

        pedidosProdutosDb.get(produtoKey)
            .then(function (doc) {

                if(doc.QTD > 1 ){

                    doc.QTD = Number(doc.QTD) - 1
                    doc.SUBTOTAL = doc.QTD * doc.PRECO_VENDA_PRODUTO

                    doc.SUBTOTAL = parseFloat(doc.SUBTOTAL.toFixed(2));

                    return pedidosProdutosDb.put(doc).then((res) => {   
                        callback({ error: false})
                    });
                }
                
            }).catch(function (err) {
                console.log(err)
                callback({ erro: true, message: err })
            })
    },

    updatePedido: (pedido, callback)=>{
 
        pedidosDb.get(String(pedido.PEDIDO_ID))
            .then(function (doc) {

                pedido._rev = doc._rev

                return pedidosDb.put(pedido).then((res) => {
                    callback({ error: false, data: pedido })
                });

            }).catch(function (err) {
                console.log(err)
                callback({ erro: true, message: err })
            })
 
    },

    removeProdutoPedido: (produtoKey, callback)=>{
        
        pedidosProdutosDb.get(produtoKey)
            .then(function (doc) {

                return pedidosProdutosDb.remove(doc)
                .then((res) => {
                    callback({ error: false })
                });

            }).catch(function (err) {
                console.log(err)
                callback({ erro: true, message: err })
            })
    },

    excluirPedido: (pedidoId, callback) => {

        pedidosProdutosDb.search({
            query: pedidoId,
            fields: ['PEDIDO_ID'],
            include_docs: true
        }).then((res) => {
             
            let prom = new Promise((resolve, reject)=>{
                
                let produtos = []

                res.rows.forEach((i,k) => {
                    
                    i._deleted = true
                    i._rev = i.doc._rev
                    i._id = i.doc._id

                    delete i.doc
                    delete i.score

                    produtos.push(i)

                    if (k == res.total_rows - 1) {
                        resolve(produtos)
                    }                    
                })

            })

            prom.then((res)=>{
                console.log('DELETANDO')
                console.log(res)

                pedidosProdutosDb.bulkDocs(res)
                    .then(function (result) {
                        console.log('PROCESSADO')
                        console.log(result)
                    }).catch(function (err) {
                        console.log(err);
                    });
                                
            })

        }).catch((err) => {
            console.log(err)
        }) 

        pedidosDb.get(String(pedidoId))
            .then(function (doc) {

                return pedidosDb.remove(doc)
                    .then((res) => {
                        callback({ error: false })
                    });

            }).catch(function (err) {
                console.log(err)
                callback({ erro: true, message: err })
            })
    }
}