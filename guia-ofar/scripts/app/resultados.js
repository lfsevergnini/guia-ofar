function changeImage(id, logo) {
    var imagem = "";
    if (logo != '')        
    {
        $.get(CAMINHO_LOGO + logo).done(function () {
            $("#li_result_" + id).find('.blank').attr('src', CAMINHO_LOGO + logo);
        });
    }
}

app.atualizarResultados = function(busca) {
	var renderEmpresa = function (row) {        
        var empresa  = "<li value='" + row.id + "' id='li_result_" + row.id + "' onclick=\"ID_EMPRESA = " + row.id + "; app.mobileApp.navigate('views/visualizar_empresa.html', 'fade');\">";
            empresa += "<span style='float:right;'><a class='result-link' href='tel:" + row.phone.replace(/ /g, '') + "'>";
            empresa += "<img src='images/phone.png' style='margin-top: 12px; height: 35px'/></a></span>";
            empresa += "<img class='blank' src='images/no.png' style=\"float: left; margin: 7px 10px 7px 0px; width:75px; height: 50px;\" /><span class='result-nome'>" + row.name + "</span><br/>";
            empresa += "<span class='result-end'>" + row.address + "</span></li>";
        
        // Troca a imagem da empresa, se houver uma personalizada
        changeImage(row.id, row.logoLocation);
        
        return empresa;
	}
    
	var render = function (tx, rs) {
        // Realiza algumas mudanças de última hora na interface
        $("#menu_opcoes_res").removeClass("km-button").css("display", "inline");
        
        var numResultados = document.getElementById("numResultados");
        var resultados = document.getElementById("resultadosLista");
        var naoResultados = document.getElementById("semResultados");
        
        //Se há resultados para mostrar, exibe-os
        if (rs.rows.length > 0)
        {
            var rowOutput = "";
            for (var i = 0; i < rs.rows.length; i++) {
                rowOutput += renderEmpresa(rs.rows.item(i));
            }
            resultados.innerHTML = rowOutput;
            naoResultados.innerHTML = "";
        } else 
        {
            // Caso contrário, exibe uma mensagem que diz "não há resultados"
            var rowOutput = "";
            
            // Adiciona a mensagem à DIV            
            naoResultados.innerHTML = rowOutput;
            resultados.innerHTML = "";
        }
        
        // Exibe o número de resultados
        var mensagemResultados;
        if (rs.rows.length == 1) {
            mensagemResultados = "1 resultado encontrado";
        } else if (rs.rows.length > 1) {
            mensagemResultados = rs.rows.length + " resultados encontrados";
        } else {
            mensagemResultados = "Nenhum resultado foi encontrado";
        }        
        numResultados.innerHTML = "<span>" + mensagemResultados + "</span>";
        
        // Executa alguns ajustes na interface
        $("#menu_opcoes2").removeClass("km-button");
	}
    
	var db = DB;
	db.query.transaction(function(tx) {
        // Realiza a consulta de acordo com os critérios impostos pelo usuário
        var sql  = "SELECT empresas.id, empresas.name, empresas.address, empresas.phone, empresas.logoLocation FROM empresas ";
            sql += "LEFT JOIN empresas_categorias ON empresas.id = empresas_categorias.companyId ";
            sql += "LEFT JOIN categorias ON categorias.id = empresas_categorias.categoryId ";
            sql += busca.getWhere();
            sql += " GROUP BY empresas.id";
            sql += " ORDER BY empresas.package_id DESC, empresas.name ASC";
        console.log(sql);
        // Executa a consulta
		try {
            tx.executeSql(sql, [], 
                          render, 
                          app.onError);
        } catch(err){}
	});
}