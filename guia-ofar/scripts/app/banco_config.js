var DB = (function () {
    'use strict';

    var db = (function () {
        var numRows = 0;
        var query = null;

        // Inicializa o banco
        var init = function () {
            // Open/Create the database
            openDb();
            createTables();
            countRows();

            // Insere apenas se a tabela estiver vazia (importa os dados)
            window.setTimeout(function () {
                if (numRows === 0) {
					// Da mesma forma aqui, tenta atualizar após a criação do banco
                    insertData(updateData);

                }
				// Senão, tenta atualizar a base
				else {
					updateData();
				}
            }, 750);
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
        }

		// Função que cria as tabelas e insere os dados
        var createTables = function () {
            DB.query.transaction(function (tx) {
                // Cria tabela de empresas
                var sql = "CREATE TABLE IF NOT EXISTS empresas ";
                sql += "(id INTEGER PRIMARY KEY ASC, name VARCHAR(120), address TEXT, city VARCHAR(60), keywords TEXT, ";
                sql += " description TEXT, phone VARCHAR(25), fax VARCHAR(25), mobile VARCHAR(25), email VARCHAR(120), ";
                sql += " website VARCHAR(120), mainSubcategory INTEGER, logoLocation TEXT, ";
                sql += " creationDate DATETIME, modified DATETIME, ";
                sql += " facebook VARCHAR(120), twitter VARCHAR(120), googlep VARCHAR(120), package_id INTEGER(2), "
                sql += " nameNA VARCHAR(120), keywordsNA TEXT, descriptionNA TEXT)";
                tx.executeSql(sql, []);

                // Cria tabela de categorias
                var sql = "CREATE TABLE IF NOT EXISTS categorias ";
                sql += "(id INTEGER PRIMARY KEY ASC, parentId INTEGER, name VARCHAR(120), description TEXT)";
                tx.executeSql(sql, []);

                // Cria tabela de relação empresas-categorias
                var sql = "CREATE TABLE IF NOT EXISTS empresas_categorias (companyId INTEGER, categoryId INTEGER)";
                tx.executeSql(sql, []);
            });
            
            // Cria uma variável local com a data da última alteração do banco
            localStorage["lastUpdateOfar"] = dataMySQL(new Date());
        }

        var countRows = function () {
            DB.query.transaction(function (tx) {
                tx.executeSql(
                    "SELECT COUNT(id) AS cnt FROM empresas;", [],
                    function (tx, res) {
                        numRows = res.rows.item(0).cnt;
                    },
                    function (tx, res) {
                        alert('Erro ao selecionar a quantidade de registros: ' + res.message);
                    });
            });
        }

        var insertData = function (callback) {
            // Lê os arquivos de importação de empresas
            window.jQuery.getJSON(
                "database/empresas.json"
            ).done(function (data) {
                var empresas = data;
                // Insere as empresas no banco de dados
                DB.query.transaction(function (tx) {
                    for (var i = 0; i < empresas.length; i++) {
                        tx.executeSql(
                            "INSERT INTO empresas VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [empresas[i].id, empresas[i].name, 
                                 empresas[i].address, empresas[i].city, empresas[i].keywords, empresas[i].description, empresas[i].phone, 
                                 empresas[i].fax, empresas[i].mobile, empresas[i].email, empresas[i].website, empresas[i].mainSubcategory, empresas[i].logoLocation,
                                 empresas[i].creationDate, empresas[i].modified, empresas[i].facebook, empresas[i].twitter, empresas[i].googlep, empresas[i].package_id,
                                 removerAcentos(empresas[i].name), removerAcentos(empresas[i].keywords), removerAcentos(empresas[i].description)],
                            function (tx, res) {
                                console.log(res.insertId);
                            },
                            function (tx, res) {
                                console.log('Erro ao inserir registro: ' + res.message);
                            }
                        )
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
                        tx.executeSql(
                            "INSERT INTO categorias VALUES (?,?,?,?)", [categorias[i].id, categorias[i].parentId, categorias[i].name, categorias[i].description],
                            function (tx, res) {
                                console.log(res.insertId);
                            },
                            function (tx, res) {
                                console.log('Erro ao inserir registro: ' + res.message);
                            }
                        )
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
                        tx.executeSql(
                            "INSERT INTO empresas_categorias VALUES (?,?)", [categorias[i].companyId, categorias[i].categoryId],
                            function (tx, res) {
                                console.log(res.insertId);
                            },
                            function (tx, res) {
                                console.log('Erro ao inserir registro: ' + res.message);
                            }
                        )
                    }
                });
			});            
        };
		
		// Função responsável por atualizar o banco de dados
		var updateData = function () {
			// Define o valor da última atualização
		    var dataAtualizacao;
			if (localStorage.getItem("lastUpdateOfar") === null) {
				dataAtualizacao = dataMySQL(new Date());
			} else {
				dataAtualizacao = localStorage.getItem("lastUpdateOfar");
			}
			
			// Busca as queries de atualização
            window.jQuery.getJSON(
                "http://guia.ofar.com.br/app_service.php?tipo=1&data=" + dataAtualizacao
            ).done(function (data) {
                var queries = data;
                // Insere as empresas no banco de dados
                DB.query.transaction(function (tx) {
                    for (var i = 0; i < queries.length; i++) {
                        tx.executeSql(queries[i], []);
                    }
					
					// Atualiza a data da última atualização
					localStorage["lastUpdateOfar"] = dataMySQL(new Date());
                });
            });
		}

        return {
            init: init,
            numRows: numRows,
            openDB: openDb,
            createTables: createTables,
            countRows: countRows,
            insertData: insertData,
			updateData: updateData,
            query: query
        };

    }());

    return db;

}(window));