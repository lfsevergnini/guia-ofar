function validarFormulario() {
    if ($.trim($("#form_nome").val()) == "" ||
        $.trim($("#form_email").val()) == "" || 
        !IsEmail($.trim($("#form_email").val())) ||
        $.trim($("#form_mensagem").val()) == "")
    {
        app.showAlert("Por favor, preencha todos os campos corretamente!", null, "Informação");
        return false;
    }
    return true;
}

function enviarEmail() {
    $.ajax({
        url: CAMINHO_EMAIL, 
        dataType: 'json',
        data: {
            nome:$("#form_nome").val(),
            email:$("#form_email").val(),
            recado:$("#form_mensagem").val()
        },
        success: function (data) {
            if (data.status == 200) {
                app.showAlert("Muito obrigado pelo seu feedback! Você está ajudando a melhorar o Guia OFAR!", null, "Informação");
            } else {
                app.showAlert("Desculpe-nos! Ocorreu um erro ao enviar sua mensagem.", null, "Erro ao enviar e-mail");
            }
            
            limparFomrulario();
        },
        error: function (e) {
            app.showAlert("Desculpe-nos! Ocorreu um erro ao enviar sua mensagem.", null, "Erro HTTP");
            limparFomrulario();
        }
    });
}

function limparFomrulario () {
    $("#form_contato").hide();
    $("#form_nome").val('');
    $("#form_email").val('');
    $("#form_mensagem").val('');
}