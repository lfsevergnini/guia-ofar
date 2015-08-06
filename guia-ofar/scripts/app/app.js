var app = (function (win) {
    'use strict';

    // Global error handling
    var showAlert = function (message, title, callback) {
        navigator.notification.alert(message, callback || function () {}, title, 'OK');
    };

    var showError = function (message) {
        showAlert(message, 'Error occured');
    };

    win.addEventListener('error', function (e) {
        e.preventDefault();

        var message = e.message + "' from " + e.filename + ":" + e.lineno;

        showAlert(message, 'Error occured');

        return true;
    });

    // Global confirm dialog
    var showConfirm = function (message, title, callback) {
        navigator.notification.confirm(message, callback || function () {}, title, ['OK', 'Cancel']);
    };

    var isNullOrEmpty = function (value) {
        return typeof value === 'undefined' || value === null || value === '';
    };

    var isKeySet = function (key) {
        var regEx = /^\$[A-Z_]+\$$/;
        return !isNullOrEmpty(key) && !regEx.test(key);
    };

    var fixViewResize = function () {
        if (device.platform === 'iOS') {
            setTimeout(function () {
                $(document.body).height(window.innerHeight);
            }, 10);
        }
        
        // Ajusta o "carregando" para o centro da página
        if (window.innerHeight > window.innerWidth) {
            $("#first_access").css("padding-top", "50%");
            //$("#app_footer").css("height", "5%");
        } else{
            $("#first_access").css("padding-top", "20%");
            //$("#app_footer").css("height", "7.5%");
        }
    };

    // Handle device back button tap
    var onBackKeyDown = function (e) {
        e.preventDefault();

        // Verifica se o usuário deseja sair da aplicação
        if (window.location.href == INDEX) {
            AppHelper.exitApp();
        } else {
            // Reseta os banners
            if (app.helper.internetDisponivel()) 
            {
                exibirBanner();
            }
            
            history.back();
        }
    };

    // Evento chamado quando os recursos estão todos carregados
    var onDeviceReady = function () {
        // Handle "backbutton" event
        document.addEventListener('backbutton', onBackKeyDown, false);

        // Inserção concluída
        //document.addEventListener('doneloading', onDoneLoading, false);

        navigator.splashscreen.hide();
        fixViewResize();

        // Inicia o banco de dados
        DB.init();
        
        // Realiza algumas mudanças de última hora na interface
		$("#menu_opcoes").removeClass("km-button");
        
        // Carrega o banner
        if (app.helper.internetDisponivel())
            exibirBanner();
    };

    // Handle "deviceready" event
    document.addEventListener('deviceready', onDeviceReady, false);
    // Handle "orientationchange" event
    document.addEventListener('orientationchange', fixViewResize);

    var AppHelper = {

        // Date formatter. Return date in d.m.yyyy format
        formatDate: function (dateString) {
            return kendo.toString(new Date(dateString), 'MMM d, yyyy');
        },
        // Sai da aplicação
        exitApp: function () {
            var exit = function () {
                navigator.app.exitApp();
            };
            exit();
            exit();    
        },
        // Verifica se há conexão com a internet.
        internetDisponivel: function () {
            return navigator.connection.type != Connection.NONE;
        }
    };

    var os = kendo.support.mobileOS,
        statusBarStyle = os.ios && os.flatVersion >= 700 ? 'black-translucent' : 'black';

    // Initialize KendoUI mobile application
    var mobileApp = new kendo.mobile.Application(document.body, {
        transition: 'slide',
        statusBarStyle: statusBarStyle,
        skin: 'flat'
    });

    var getYear = (function () {
        return new Date().getFullYear();
    }());

    return {
        showAlert: showAlert,
        showError: showError,
        showConfirm: showConfirm,
        isKeySet: isKeySet,
        mobileApp: mobileApp,
        helper: AppHelper,
        getYear: getYear
    };
}(window));