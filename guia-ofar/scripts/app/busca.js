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
        var renderCategorias = function (categorias) {
            // Insere os valores obtidos no select
            var rowOutput = "";
            var select = document.getElementById("buscaCategorias");
            
            // Monta as opçoes do select
            for (var i = 0; i < categorias.length; i++) {
                rowOutput += "<a data-role='button' onclick='app.Busca.buscarCategoria(" + categorias[i].id+ ")'><li>" + categorias[i].name + "</span></li></a>";
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
        var buscar = function () {
            // Inicializa as variáveis
            $buscaWhere = "WHERE ";
            var where = "", termoBusca = $buscaTermo.val();

            // Verifica se há parâmetros para a consulta
            if (termoBusca != '') {
                // Modifica o WHERE baseado na busca            
                where += " (empresas.name LIKE '%" + termoBusca + "%' OR empresas.nameNA LIKE '%" + termoBusca + "%' ";
                where += " OR empresas.keywords LIKE '%" + termoBusca + "%' OR empresas.keywordsNA LIKE '%" + termoBusca + "%' ";
                where += " OR empresas.description LIKE '%" + termoBusca + "%' OR empresas.descriptionNA LIKE '%" + termoBusca + "%')";
            }

            // Finaliza a cláusula de busca
            $buscaWhere = (where === "") ? where : $buscaWhere + where;

            // Vai para a página de resultados
            redirecionarParaPagina();
        };
        
        // Realiza a busca
        var buscarResultado = function () {
            // Inicializa as variáveis
            $buscaWhere = "WHERE ";
            var where = "", termoBusca = $("#buscaTermoRes").val();

            // Verifica se há parâmetros para a consulta
            if (termoBusca != '') {
                // Modifica o WHERE baseado na busca            
                where += " (empresas.name LIKE '%" + termoBusca + "%' OR empresas.nameNA LIKE '%" + termoBusca + "%' ";
                where += " OR empresas.keywords LIKE '%" + termoBusca + "%' OR empresas.keywordsNA LIKE '%" + termoBusca + "%' ";
                where += " OR empresas.description LIKE '%" + termoBusca + "%' OR empresas.descriptionNA LIKE '%" + termoBusca + "%')";
            }

            // Finaliza a cláusula de busca
            $buscaWhere = (where === "") ? where : $buscaWhere + where;

            // Vai para a página de resultados
            redirecionarParaPagina();
        };
        
        // Busca todos os itens de uma categoria
        var buscarCategoria = function (id) {
            // Inicializa as variáveis
            $buscaWhere = "WHERE ";

            // Monta a cláusula where
            $buscaWhere += " (categorias.id = " + id + " OR empresas.mainSubcategory = " + id + ")";

            // Vai para a página de resultados
            redirecionarParaPagina();
        }
        
        var redirecionarParaPagina = function () {
            // Chama a função que atualiza a página
            if (!primeiroAcessoBusca) {
                app.atualizarResultados(app.Busca);
                
                // Reseta a view
                $(".km-scroll-container").css("-webkit-transform", "translate3d(0px, 0px, 0px) scale(1)");
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
            buscarResultado: buscarResultado,
            buscarCategoria: buscarCategoria,
            getWhere: getWhere
        };

    }());

    return buscaViewModel;

}());