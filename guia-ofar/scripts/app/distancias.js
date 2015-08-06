var DistanceMatrix = null;

if (google != null && google != undefined && google.maps != null && google.maps != undefined)
    DistanceMatrix = new google.maps.DistanceMatrixService();

/* Função que realiza a query para obter a distância entre os locais */
function obterDistancia(origem, destinos, modoViagem, evitarRodovias, evitarPedagios, callback) 
{
    if (DistanceMatrix != null) 
    {
        DistanceMatrix.getDistanceMatrix({
            origins: [origem],
            destinations: destinos,
            travelMode: modoViagem,
            avoidHighways: evitarRodovias,
            avoidTolls: evitarPedagios
        }, callback);
    }
}