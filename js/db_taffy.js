let deviceDb = TAFFY()
let representantesDb = TAFFY();
let clientesDb = TAFFY();
let produtosDb = TAFFY();
let pedidosDb = TAFFY();
let pedidosProdutosDb = TAFFY();

var db = {

    initBD: ()=>{

        console.log('Iniciando DB')
       
    },

    syncTables: function(tables){
        
        if(tables.representantes){
            db.syncRepresentantes(tables.representantes)
            console.log('sync representantes')        
        }

        // if (tables.clientes) {
        //     db.syncClientes(tables.clientes)            
        // }

        // if (tables.produtos) {         
        //     db.syncProdutos(tables.produtos)
        // }
    },

    syncRepresentantes: (representantes)=>{

        var prom = new Promise( (resolve, reject)=>{

            representantesDb.insert(representantes)

            representantesDb().each( function(res){
                console.log(res)

                resolve()
            })

            // representantesDb.count({}, function(err,count){

            //     if (err) {

            //         reject(err)

            //     } else {

            //         representantesDb.remove({}, function (err, numRemove) {
            //             representantesDb = new Nedb({ filename: 'representantes.db', autoload: true });

            //             console.log('fazendo laco')
            //             representantes.forEach(function (t, k) {
            //                 t._id = t.CODIGO

            //                 if (representantes.lenght === k - 1) {
            //                     console.log('laco feito')
            //                     resolve(representantes)
            //                 }
            //             })
            //         }) 
            //     }
            // })
             
        })

        prom.then( ()=>{
            console.log('inserindo')
                       
            console.log('Representantes sincronizados')
        }).catch((error) => {
            console.log(error)
        })
    },

    syncClientes: (clientes)=>{

        var prom = new Promise( (resolve, reject)=>{

            clientesDb.count({}, function (err, count) {

                if (err) {

                    reject()

                } else {

                    if (count > 0) {
                        clientesDb.remove({}, function (err, numRemove) {
                            clientesDb = new Nedb({ filename: 'clientes.db', autoload: true });
                            resolve()
                        })
                    } else {
                        resolve()
                    }
                }
            })
        })
         
        prom.then(()=>{
            
            clientes.forEach(function (t, k) {
                t._id = t.CODIGO
            })

            clientesDb.insert(clientes, function (err, result) {
                console.log('Clientes sincronizados')
            })
        }).catch((error) => {

            console.log(error)
        })
    },

    syncProdutos: (produtos) => {

        var prom = new Promise((resolve,reject)=>{

            produtosDb.count({}, function (err, count) {

                if (err) {

                    reject(err)

                } else {

                    if (count > 0) {
                        produtosDb.remove({}, function (err, numRemove) {
                            produtosDb = new Nedb({ filename: 'produtos.db', autoload: true });
                            resolve()

                        })
                    } else {
                        resolve()
                    }

                }

            })
        })

        prom.then((callback)=>{

            produtos.forEach(function (t, k) {
                t._id = t.CODIGO
                t.PRECO_VENDA_PRODUTO = t.PRECO_VENDA_PRODUTO.replace(',', '.')

                if( produtos.lenght == k-1){
                    return callback(produtos)
                }
            })

        }).then( (rs)=>{

            console.log(rs)

            produtosDb.insert(rs, function (err, result) {
                console.log('Produtos sincronizados')
            })


        })
        .catch( (error)=>{

            console.log(error)
        })
        
    },

    login: (dados, callback)=>{
        
        representantesDb = new Nedb({ filename: 'representantes.db', autoload: true });
        representantesDb.find({CODIGO:dados.ID} ,function(err,doc){
            var doc = doc[0]
            console.log(doc)
            
            if(err){
                return callback({ error: true, message: err })
            }else{
                 

                if (doc.SENHA == dados.SENHA) {
                    
                    doc.SENHA = ''
                    localStorage.setItem('user_log', JSON.stringify(doc))
                    return callback({ error: false })
                } else {
                    return callback({ error: true, message: 'Senha incorreta' })
                }

            }
        })
         
    },

    pedidosAbertos: (callback) => {

        pedidosDb = new Nedb({ filename: 'pedidos.db', autoload: true }); 

        pedidosDb.find({} ,function(err,docs){

            if(err){
                console.log(err)
            }else{
                callback(docs)
            }
        })
        // pedidosDb.search({
        //     query: 'ABERTO',
        //     fields: ['PEDIDO_STATUS'],
        //     include_docs: true,
        // }).then(function (res) {
        //     callback(res)
        // }).catch(function (err) {
        //     callback(err)
        // })
    },

    pedidosFechados: (callback) => {

        // pedidosDb.search({
        //     query: 'FECHADO',
        //     fields: ['PEDIDO_STATUS'],
        //     include_docs: true,
        // }).then(function (res) {
        //     callback(res)
        // }).catch(function (err) {
        //     callback(err)
        // })
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
    },

    limpaBase: (callback) => {

        model.cAlert('Limpando base', 'success', 2000)

        localDb.transaction(function (tx) {
            tx.executeSql(
                "DROP TABLE IF EXISTS pesquisas",
                [],
                function (tx, rs) { 
                },
                function (tx, error) {                    
                    return callback({ error: true, message: 'Erro consulta upColetas : ' + error.message })
                } 
            )

            tx.executeSql(
                "DROP TABLE  IF EXISTS coletas",
                [],
                function (tx, rs) {
                },
                function (tx, error) {
                    return callback({ error: true, message: 'Erro consulta upColetas : ' + error.message })
                }
            )

            tx.executeSql(
                "DROP TABLE  IF EXISTS coletas_extras",
                [],
                function (tx, rs) {
                },
                function (tx, error) {
                    return callback({ error: true, message: 'Erro consulta upColetas : ' + error.message })
                }
            )

            tx.executeSql(
                "DROP TABLE  IF EXISTS locais_extras",
                [],
                function (tx, rs) {
                },
                function (tx, error) {
                    return callback({ error: true, message: 'Erro consulta upColetas : ' + error.message })
                }
            )


        }, function (error) {

            console.log('Erro (transação upColetas ) : ' + error.message)
            return callback({ error: true, message: 'Erro (transação upColetas ) : ' + error.message })

        }, function () {

            return callback({ error: false, message: 'Limpeza processada' })

        })



        
    }
}