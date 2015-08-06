var DB = (function () {
    'use strict';

    var db = (function () {
        var query = null;

        // Inicializa o banco
        var init = function () {
            // Open/Create the database
            openDb();
            
            // Verifica se este é o primeiro acesso (se for, criará o banco e realizará a inserção de dados)
            if (localStorage.getItem("lastAccessOfar") === null) {
                // Exibe a tela de "loading" do primeiro acesso
                exibirTransicao(true);
                
                // Cria as tabelas e realiza as inserções
                insertData(updateData);
                
                // Grava a data atual como a data inicial do banco de dados
                localStorage["lastAccessOfar"] = dataMySQL(new Date());
            }
            // Senão, tenta atualizar a base
            else {
                updateData();
            }
        }

        // Define o banco de dados
        var openDb = function () {
            if (window.navigator.simulator === true) {
                // For debugin in simulator fallback to native SQL Lite
                console.log("Use built in SQL Lite");
                DB.query = window.openDatabase("guia_ofar", "1.0", "Cordova Demo", 200000);
            } else {
                DB.query = window.sqlitePlugin.openDatabase("guia_ofar");
            }
            
            createTables();
        }

		// Função que cria as tabelas e insere os dados
        var createTables = function () {
            DB.query.transaction(function (tx) {
                // Cria tabela de empresas
                /*try {
                	tx.executeSql("DROP TABLE empresas", []);
                } catch (err) {}*/
                
                var sql = "CREATE TABLE IF NOT EXISTS empresas ";
                sql += "(id INTEGER PRIMARY KEY ASC, name VARCHAR(120), address TEXT, city VARCHAR(60), keywords TEXT, ";
                sql += " description TEXT, phone VARCHAR(25), fax VARCHAR(25), mobile VARCHAR(25), email VARCHAR(120), ";
                sql += " website VARCHAR(120), mainSubcategory INTEGER, logoLocation TEXT, ";
                sql += " creationDate DATETIME, modified DATETIME, ";
                sql += " facebook VARCHAR(120), twitter VARCHAR(120), googlep VARCHAR(120), package_id INTEGER(2), ";
                sql += " state INTEGER(2), approved INTEGER(2), ";
                sql += " nameNA VARCHAR(120), keywordsNA TEXT, descriptionNA TEXT)";
                
                try {
                	tx.executeSql(sql, []);
                } catch (err) {}

                // Cria tabela de categorias
                /*try {
                	tx.executeSql("DROP TABLE categorias", []);
                } catch (err) {}*/
                
                sql = "CREATE TABLE IF NOT EXISTS categorias ";
                sql += "(id INTEGER PRIMARY KEY ASC, parentId INTEGER, name VARCHAR(120), description TEXT)";
                
                try {
                	tx.executeSql(sql, []);
                } catch(err){}

                // Cria tabela de relação empresas-categorias
                /*try {
                	tx.executeSql("DROP TABLE empresas_categorias", []);
                } catch (err) {}*/
                
                sql = "CREATE TABLE IF NOT EXISTS empresas_categorias (companyId INTEGER, categoryId INTEGER)";
                
                try {
                	tx.executeSql(sql, []);
                } catch(err){}
            });
            
            // Cria uma variável local com a data da última alteração do banco
            localStorage["lastUpdateOfar"] = ULTIMA_ATUALIZACAO;
        }

        var insertData = function (callback) {
            // Lê os arquivos de importação de empresas
            window.jQuery.getJSON(
                "database/empresas.json"
            ).done(function (data) {
                var empresas = data;
                // Insere as empresas no banco de dados
                DB.query.transaction(function (tx) {
                    // Exclui todos os registros antes de inserir os novos (em caso de inconsistência)
                    try {
                    	tx.executeSql("DELETE FROM empresas", []); /*, 
                                  function () {//console.log("Deletando todos os registros do banco...")},
                                 function (tx, res) {console.log("Erro ao deletar saporra: " + res.message)});*/
                    } catch(err){}
                    
                    // Insere os dados encontrados no .json
                    for (var i = 0; i < empresas.length; i++) {
                        try {
                            tx.executeSql(
                                "INSERT INTO empresas VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [empresas[i].id, empresas[i].name, 
                                     empresas[i].address, empresas[i].city, empresas[i].keywords, empresas[i].description, empresas[i].phone, 
                                     empresas[i].fax, empresas[i].mobile, empresas[i].email, empresas[i].website, empresas[i].mainSubcategory, empresas[i].logoLocation,
                                     empresas[i].creationDate, empresas[i].modified, empresas[i].facebook, empresas[i].twitter, empresas[i].googlep, 
                                     empresas[i].package_id, empresas[i].state, empresas[i].approved, 
                                     removerAcentos(empresas[i].name), removerAcentos(empresas[i].keywords), removerAcentos(empresas[i].description)] /*);*/ ,
                                function (tx, res) {
                                    //console.log(res.insertId);
                                },
                                function (tx, res) {
                                    //console.log('Erro ao inserir registro: ' + res.message);
                                }
                            );
                        } catch(err){}
                    }

					// Chama a função de callback
					callback();
                });
            });

            // Lê os arquivos de importação de categorias
            window.jQuery.getJSON(
                "database/categorias.json"
            ).done(function (data) {
                var categorias = data;
                // Insere as categorias no banco de dados
                DB.query.transaction(function (tx) {
                    for (var i = 0; i < categorias.length; i++) {
                        try {
                            tx.executeSql(
                                "INSERT INTO categorias VALUES (?,?,?,?)", [categorias[i].id, categorias[i].parentId, categorias[i].name, categorias[i].description]);/*,
                                function (tx, res) {
                                    console.log(res.insertId);
                                },
                                function (tx, res) {
                                    console.log('Erro ao inserir registro: ' + res.message);
                                }
                            )*/
                    	} catch(err){}
                    }
                });
            });

            // Lê os arquivos de importação da relação entre categorias e empresas
            window.jQuery.getJSON(
                "database/cat_emp.json"
            ).done(function (data) {
                var categorias = data;
                // Insere as categorias no banco de dados
                DB.query.transaction(function (tx) {
                    for (var i = 0; i < categorias.length; i++) {
                        try {
                            tx.executeSql(
                                "INSERT INTO empresas_categorias VALUES (?,?)", [categorias[i].companyId, categorias[i].categoryId]); /*,
                                function (tx, res) {
                                    console.log(res.insertId);
                                },
                                function (tx, res) {
                                    console.log('Erro ao inserir registro: ' + res.message);
                                }
                            )*/
                        } catch(err){}
                    }
                });
			});            
        };
		
		// Função responsável por atualizar o banco de dados
		var updateData = function () {
			// Define o valor da última atualização
		    var dataAtualizacao;
			if (localStorage.getItem("lastUpdateOfar") === null) {
                dataAtualizacao = ULTIMA_ATUALIZACAO;
			} else {
				dataAtualizacao = localStorage.getItem("lastUpdateOfar");
			}
			
			// Busca as queries de atualização
            window.jQuery.getJSON(
                CAMINHO_SERVICO + "?tipo=1&data=" + dataAtualizacao
            ).done(function (data) {
                var queries = data;

                // Insere as empresas no banco de dados
                DB.query.transaction(function (tx) {
                    for (var i = 0; i < queries.length; i++) {
                        try {
                            tx.executeSql(queries[i], [] /*); */, 
                             function (tx, res) {
                                    //console.log("Atualizando a fera: " + res.message );
                            }, 
                             function (tx, res) {
                                    //console.log("Erro na fera: " + " - " + res.message);
                            });
                        } catch (err) {}
                    }
					
					// Atualiza a data da última atualização
					localStorage["lastUpdateOfar"] = dataMySQL(new Date());
                });
            }).always(function (data) {
                // Reexibe a view principal
                exibirTransicao(false);
            });
		}
        
        // Realiza um fade in/out da tela inicial principal
        var exibirTransicao = function (esconderPrincipal) {
            if (esconderPrincipal) {
                $("#first_access").fadeIn();
                $("#normal_access").fadeOut();
                $("#header").hide();                
            } else 
            {
                $("#first_access").hide();
                $("#normal_access").fadeIn();
                $("#header").show();                
            }
        }

        return {
            init: init,
            openDB: openDb,
            createTables: createTables,
            insertData: insertData,
			updateData: updateData,
            exibirTransicao: exibirTransicao,
            query: query
        };

    }());

    return db;

}(window));