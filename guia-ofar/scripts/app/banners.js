var banners = ["#footer_banner", "#footer_banner2", "#footer_banner3"];

function esconderBanners() {
    for (var i = 0; i < banners.length; i++)
    {
        $(banners[i]).hide();
    }
}

function exibirBanner () 
{   
    // Realiza a requisição AJAX para cada banner
    if (app.helper.internetDisponivel())
    {
        $.ajax({
            url: CAMINHO_BANNERS + "banners.json",
            success: function (dados) {
                /* Acesso ao arquivo de configuração IMG x LINK */
                if (dados.length > 0)
                {
                    // Índice aleatório do vetor de banners
                    var auxRand;
                    
                    // Escolhe uma das imagens aleatoriamente para cada banner
                    for (var i = 0; i < banners.length; i++) {
                        // Sorteia um número aleatório
                        auxRand = Math.floor((Math.random() * dados.length));

                        // Exibe o banner
                        $(banners[i]).show();
                        $(banners[i]).attr("src", CAMINHO_BANNERS + dados[auxRand].imagem);
                        $(banners[i]).parent().unbind('click').click(function () {
                            abrirLink(dados[auxRand].link);
                            return false;
                        });
                    }
                } else {
                    esconderBanners();
                }
            },
            error: function (response) {
               esconderBanners();
            }
        });
    } else {
        esconderBanners();
    }
}