app.visualizarEmpresa = function() {
    // Renderiza os dados da empresa    
	var render = function (tx, rs) {
        var enderecoCompleto = rs.rows.item(0).address + ", Farroupilha, RS - Brasil";
        
        // Elementos visuais
        var divConteudo = document.getElementById("visemp_div");        
        var name = document.getElementById("visemp_name");
        var phone = document.getElementById("visemp_phone");
        var phone_link = document.getElementById("visemp_phonelink");
        var fax = document.getElementById("visemp_fax");
        var fax_link = document.getElementById("visemp_faxlink");
        var mobile = document.getElementById("visemp_mobile");
        var mobile_link = document.getElementById("visemp_mobilelink");
        var address = document.getElementById("visemp_address");
        var distance = document.getElementById("visemp_distance");
        var description = document.getElementById("visemp_description");
        var email = document.getElementById("visemp_email");
        var email_link = document.getElementById("visemp_email_link");
        var site = document.getElementById("visemp_site");
        var facebook = document.getElementById("visemp_facebook");
        var twitter = document.getElementById("visemp_twitter");
        var googlep = document.getElementById("visemp_googlep");
        var mapa = document.getElementById("mapa");
        var emp_img = document.getElementById("emp_img");
        
        // Insere os dados na interface        
        distance.innerHTML = "&nbsp;";
        name.innerHTML = rs.rows.item(0).name;
        phone.innerHTML = "<small style='vertical-align:baseline;'>Fone: </small>" + rs.rows.item(0).phone;
        phone_link.href = "tel:" + rs.rows.item(0).phone.replace(/ /g, '');
        fax.innerHTML = ''; fax_link.href = '#'; $(fax).parent().hide();
        mobile.innerHTML = ''; mobile_link.href = '#'; $(mobile).parent().hide();
        address.innerHTML = rs.rows.item(0).address;
        //mapa.innerHTML = "<span id='btn_mapa'><strong>Ver mapa</strong></span>";
        
        // Verifica se há um fax para a empresa
        if (rs.rows.item(0).fax != '') {
            fax.innerHTML = "<small style='vertical-align:baseline;'>Fax: </small>" + rs.rows.item(0).fax;
            fax_link.href = "tel:" + rs.rows.item(0).fax.replace(/ /g, '');
            $(fax).parent().show();
        }
        
        // Verifica se há um celular para a empresa
        if (rs.rows.item(0).mobile != '') {
            mobile.innerHTML = "<small style='vertical-align:baseline;'>Celular: </small>" + rs.rows.item(0).mobile;
            mobile_link.href = "tel:" + rs.rows.item(0).mobile.replace(/ /g, '');
            $(mobile).parent().show();
        }
        
        // Se não houver email, não mostra o email
        if (rs.rows.item(0).email != '') {
            email.innerHTML = rs.rows.item(0).email;
            email_link.href = 'mailto:' + rs.rows.item(0).email;
            $(email.parentNode).css("display", "block");
        } else {
            email.innerHTML = '';
            $(email.parentNode).css("display", "none");
        }
        
        // Se não houver email, não mostra a descrição
        if (rs.rows.item(0).description != '') {
            description.innerHTML = rs.rows.item(0).description;
            $(description.parentNode).css("display", "block");
        } else {
            description.innerHTML = '';
            $(description.parentNode).css("display", "none");
        }
        
        // Se não houver site, facebook e twitter, esconde essa div
        if (rs.rows.item(0).website == '' && 
            rs.rows.item(0).facebook == '' && 
            rs.rows.item(0).twitter == '' &&
            rs.rows.item(0).googlep == '')
        {
            $(site.parentNode.parentNode).css("display", "none");
        } else
        {
            $(site.parentNode.parentNode).css("display", "block");
        }
        
        // Teste específico para cada rede social/site
        if (rs.rows.item(0).website == '') {
            $(site).css("display", "none");
        } else {
            $(site).find("a").attr("onclick", "abrirLink('http://" + rs.rows.item(0).website + "'); return false;");
            $(site).css("display", "inline");
        }
        
        if (rs.rows.item(0).facebook == '') {
            $(facebook).css("display", "none");
        } else {
            $(facebook).find("a").attr("onclick", "abrirLink('http://" + rs.rows.item(0).facebook + "'); return false;");
            $(facebook).css("display", "inline");
        }
        
        if (rs.rows.item(0).twitter == '') {
            $(twitter).css("display", "none");
        } else {
            $(twitter).find("a").attr("onclick", "abrirLink('http://" + rs.rows.item(0).twitter + "'); return false;");
            $(twitter).css("display", "inline");
        }
        
        if (rs.rows.item(0).googlep == '') {
            $(googlep).css("display", "none");
        } else {
            $(googlep).find("a").attr("onclick", "abrirLink('http://" + rs.rows.item(0).googlep + "'); return false;");
            $(googlep).css("display", "inline");
        }
        
        // Por último, Descobre a distância entre as localizações
        if (app.helper.internetDisponivel() && google != null && google != undefined)
        {
            var latitude = 0.0, 
                longitude = 0.0,
                destinos = [enderecoCompleto];
            
            // Pega a localização atual do celular
            navigator.geolocation.getCurrentPosition(function (position) {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                
                // Tenta realizar a consulta à matrix do google
                var origem = new google.maps.LatLng(latitude, longitude);
                obterDistancia(origem, destinos, google.maps.TravelMode.DRIVING, false, false, 
                   function (response, status) {
                       // Se a consulta deu certo, trata os resultados obtidos
                       if (status == google.maps.GeocoderStatus.OK) {
                           if (response.rows[0].elements[0].status != "ZERO_RESULTS") {
                               distance.innerHTML = response.rows[0].elements[0].distance.text;
                               $(distance).fadeIn();
                           }
                       }
                   });
            });
        }
        
        // Exibe a imagem da empresa
        if (app.helper.internetDisponivel()) {
            var altura = screen.height/2;
            
            // Verifica se é possível abrir a imagem da empresa
            $.ajax({
                /*url: CAMINHO_IMAGENS,
                success: function (e) {
                    $("#emp_img").show();
                    emp_img.innerHTML = "<div style=\"width:100%; max-height:"+ altura +"px; height:" + altura + "px; background-image: url('" + CAMINHO_IMAGENS +"'); background-size:cover\" />";
                }*/
                url: CAMINHO_IMAGENS + rs.rows.item(0).id,
                success: function (response) {
                    if (response.success)
                    {
                        $("#emp_img").show();
                        //emp_img.innerHTML = "<div style=\"width:100%; max-height:"+ altura +"px; height:" + altura + "px; background-image: url('http://"+ response.caminho +"'); background-repeat:no-repeat; background-size:cover\" />";
                        emp_img.innerHTML = "<div style='text-align:center'><img style=\"width:95%; max-height:"+ altura +"px;\" src='http://"+ response.caminho +"' />";
                    }
                     else {
                        $("#emp_img").hide();
                    }
                }
            });
        } else {
            $("#emp_img").hide();
        }
        
        // Exibe o mapa
        if (app.helper.internetDisponivel()) {
            var altura = screen.height/2;
            $("#mapa").show();
            mapa.innerHTML = "<iframe class='mapa-view'  height='"+ altura +"' frameborder='0' src='https://www.google.com/maps/embed/v1/place?key=" + API_KEY_GOOGLE_MAPS_EMBED +"&q=" + enderecoCompleto + "' />";
        } else {
            $("#mapa").hide();
        }
	}
    
	var db = DB;
	db.query.transaction(function(tx) {
        // Realiza a consulta de acordo com os critérios impostos pelo usuário
        var sql  = "SELECT * FROM empresas ";
            sql += "WHERE id = ?";
            sql += " ORDER BY empresas.name";

        // Executa a consulta
        try {
            tx.executeSql(sql, [ID_EMPRESA], 
                          render, 
                          app.onError);
        } catch(err){}
	});
    
    // Atualiza os banners
    exibirBanner();
}