function isArray(myArray) {
    return myArray.constructor.toString().indexOf("Array") > -1;
}

function removerAcentos(newStringComAcento) {
    var str = newStringComAcento;
    
    str = str.replace(/[ÀÁÂÃÄÅ]/, "A");
    str = str.replace(/[àáâãäå]/, "a");
    str = str.replace(/[ÈÉÊË]/, "E");
    str = str.replace(/[èéêë]/, "e");
    str = str.replace(/[ÌÍÎÏ]/, "I");
    str = str.replace(/[ìíîï]/, "i");
    str = str.replace(/[ÒÓÔÖÕ]/, "O");
    str = str.replace(/[òóôö]/, "o");
    str = str.replace(/[ÙÚÛÜ]/, "U");
    str = str.replace(/[ùúûü]/, "u");
    str = str.replace(/[Ç]/, "C");
    str = str.replace(/[ç]/, "c");
    str = str.replace(/[Ñ]/, "N");
    str = str.replace(/[ñ]/, "n");
    //    return str.replace(/[^a-z0-9]/gi,''); 

    return str;
}

function dataMySQL(data) {
	var timestamp = JSON.stringify(data);
	return timestamp.replace(/T/g, ' ').substring(0, 20);
}

/*
	Função que abre um link. Pode também abrir uma aplicação nos SO android e iOS.

	Utilização:
		- opcoes[0] = nome do aplicativo no android;
		- opcoes[1] = nome do aplicativo no iOS;
		- opcoes[2] = comando do aplicativo antes do 'link';
*/
function abrirLink(link, opcoes) {
    // Se houverem opcoes, altera o link de acordo com o OS e o software
    /*if (opcoes != null && opcoes != undefined)
    {
        // Se for android
        if (device.platform === 'android') {
            // Se o aplicativo desejado existir, chama-o
            appAvailability.
            
            //twitter://user?screen_name=
            link = opcoes[0] + opcoes[2] + link;
        } 
        // Se for iOS
        else if (device.platform === 'iOS') {
            
        }
    }*/
    
    window.open(link, '_system');
}