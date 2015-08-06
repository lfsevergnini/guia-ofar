/**
 * Modelo view Busca
 */

var app = app || {};
var primeiroAcessoBusca = true;

app.Busca = (function () {
    'use strict';

    var buscaViewModel = (function () {
        var $buscaTermo;
        var $buscaCategoria;
        //var $buscaCidade;
        var $buscaWhere = "";

        // Função que renderiza todos os elementos do select
        var renderCategorias = function (dados) {
            // Insere os valores obtidos no select
            var rowOutput = "";
            var select = document.getElementById("buscaCategorias");
            var categorias = [], auxCat, indexPai;
            
            // Monta a lista
            while (dados.length > 0)
            {
                // Recebe o elemento inicial da lista
                auxCat = dados[0];
                
                // Possui categoria-pai?
                if (auxCat.parentName != "")
                {
                    // Procura o pai na lista atual
                    indexPai = encontrarCategoriaNoVetor(dados, auxCat.parentName);
                    if (indexPai)
                    {
                        // Cria o vetor de filhos, caso não tenha sido criado ainda
                        if (dados[indexPai].filhos == null || dados[indexPai].filhos == undefined) {
                            dados[indexPai].filhos = [];
                        }

                        // Insere-o como filho da categoria-pai
                        dados[indexPai].filhos.push(auxCat);
                    } else {
                        // Procura o pai na lista de categorias a ser impressa
                        indexPai = encontrarCategoriaNoVetor(categorias, auxCat.parentName);
                        if (indexPai)
                        {   // Cria o vetor de filhos, caso não tenha sido criado ainda
                            if (categorias[indexPai].filhos == null || categorias[indexPai].filhos == undefined) {
                                categorias[indexPai].filhos = [];
                            }
                            
                            // Insere-o como filho da categoria-pai
                            categorias[indexPai].filhos.push(auxCat);
                        }
                    }                    
                } else { 
                    // Insere-o na lista de categorias a serem printadas
                    categorias.push(auxCat);
                }
                
                // Remove o elemento atual do array
                dados.splice(0, 1);
            }

            // Monta os itens da lista
            for (var i = 0; i < categorias.length; i++)
            {
                // Verifica se a categoria possui filhos
                if (categorias[i].filhos != undefined && categorias[i].filhos != null && isArray(categorias[i].filhos))
                {
                    rowOutput += "<li id='cat_pai_"+categorias[i].id+"'>" + categorias[i].name;
                    rowOutput += "<span style='padding:10px;' onclick=\"expandirFilhos($('#cat_pai_"+categorias[i].id+"'))\"><img src='images/plus.png' style='height: 20px; vertical-align: middle;'/></span>";
                    rowOutput += "<ul style='display:none'>";
                    // Adiciona os filhos como itens da sub-lista
                    for (var j = 0; j < categorias[i].filhos.length; j++)
                    {
                        rowOutput += "<li onclick='app.Busca.buscarCategoria(" + categorias[i].filhos[j].id+ ")'>" + categorias[i].filhos[j].name + "</li>";
                    }
                    rowOutput += "</ul></li>";
                } else {
                    rowOutput += "<li onclick='app.Busca.buscarCategoria(" + categorias[i].id+ ")'>" + categorias[i].name + "</li>";
                }
            }

            // Adiciona o conteúdo à interface
            select.innerHTML += rowOutput;
        }

        // Função que inicializa o formulário de busca
        var init = function () {
            $buscaTermo = $('#buscaTermo');
            //$buscaCategoria = $('#buscaCategoria');
            //$buscaCidade = $('#buscaCidade');

            // Carrega os campos de categoria
            // Lê os arquivos de importação de categorias
            window.jQuery.getJSON(
                "database/categorias.json"
            ).done(function (data) {
                // Chama a função que renderiza as categorias
                renderCategorias(data);
            });
        };

        // Função que renderiza o formulário de busca
        var show = function () {
            $("#buscaTermoRes").val('');
        };

        // Realiza a busca
        var buscar = function (campoForm) {
            // Inicializa as variáveis
            $buscaWhere = "WHERE empresas.state <> 0 AND empresas.approved <> 1 AND empresas.package_id <> 1 ";
            var where = "", termoBusca = "";
            
            // Verifica qual foi o botão responsável pela busca
            if (campoForm == "#buscaTermo" ||
               (campoForm !== null && typeof campoForm === 'object' && $(campoForm.sender.element).attr('id') == "buscar"))
                termoBusca = $("#buscaTermo").val();
            else if (campoForm == "#buscaTermoRes" ||
               (campoForm !== null && typeof campoForm === 'object' && $(campoForm.sender.element).attr('id') == "buscarRes"))
                termoBusca = $("#buscaTermoRes").val();
            else if (campoForm == "#buscaTermoVis" ||
               (campoForm !== null && typeof campoForm === 'object' && $(campoForm.sender.element).attr('id') == "buscarVis"))
                termoBusca = $("#buscaTermoVis").val();
            
            // Retorna falso se não houver no mínimo três caracteres na busca
            if (termoBusca.length < 3) {            
                return false;
            }

            // Modifica o WHERE baseado na busca            
            where += " (empresas.name LIKE '%" + termoBusca + "%' OR empresas.nameNA LIKE '%" + termoBusca + "%' ";
            where += " OR empresas.keywords LIKE '%" + termoBusca + "%' OR empresas.keywordsNA LIKE '%" + termoBusca + "%' ";
            where += " OR empresas.description LIKE '%" + termoBusca + "%' OR empresas.descriptionNA LIKE '%" + termoBusca + "%')";

            // Finaliza a cláusula de busca
            $buscaWhere = (where === "") ? $buscaWhere : $buscaWhere + " AND " + where;

            // Vai para a página de resultados
            redirecionarParaPagina();
            
            // Atualiza o banner
            exibirBanner();
        };
        
        // Busca todos os itens de uma categoria
        var buscarCategoria = function (id) {
            // Inicializa as variáveis
            $buscaWhere = "WHERE empresas.state <> 0 AND empresas.approved <> 1 AND empresas.package_id <> 1 ";

            // Monta a cláusula where
            $buscaWhere += " AND (categorias.id = " + id + " OR empresas.mainSubcategory = " + id + ")";

            // Vai para a página de resultados
            redirecionarParaPagina();
            
            // Atualiza o banner
            exibirBanner();
        }
        
        var redirecionarParaPagina = function () {
            // Chama a função que atualiza a página
            if (!primeiroAcessoBusca) {
                app.atualizarResultados(app.Busca);
                
                // Reseta a view
                $("#resultados_container").parent().css("-webkit-transform", "translate3d(0px, 0px, 0px) scale(1)");
            } else {
                primeiroAcessoBusca = false;
            }

            // Redireciona para a página de busca
            app.mobileApp.navigate('views/resultados_busca.html', 'overlay');
        }

        var getWhere = function () {
            return $buscaWhere;
        }

        return {
            init: init,
            show: show,
            getYear: app.getYear,
            buscar: buscar,
            buscarCategoria: buscarCategoria,
            getWhere: getWhere
        };

    }());

    return buscaViewModel;

}());