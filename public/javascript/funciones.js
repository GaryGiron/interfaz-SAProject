var form = new FormData();
var consultajuego='http://localhost/consultaravance/';
var enviajuego='http://localhost/enviaravance/';
var tiradados='http://localhost:3000/tirar/3';
var finpartida='http://localhost:3400/partidas/';
var interfaz ="http://localhost:3100/"
var juegos="http://34.70.148.27:5000/"
var posInicial=[1,1];
turno=0;
data="";

function resaltar(jQuery){
    /*var settingsobtT = {
        "url": juegos+"obtenerPosicion/"+idjuego,
        "method": "GET",
        "timeout": 0,
    };
    $.ajax(settingsobtT).done(function (response) {
        data=JSON.parse(response);
        ocultarTodo();
        mostrarPos(data);
    });*/
    var data = window.location+"";
    var res = data.split("/");
    console.log(res[7]);
    console.log(res[8]);
    //pos1 = url.searchParams.get("pos1");
    //var pos1 = getParameterByName('pos1');
    //var pos2 = getParameterByName('pos2');
    ocultarTodo();
    mostrarPos(res[7], res[8]);
    //console.log(pos1);
    //console.log(pos2);
    //mostrarPos(pos1, pos2);
}
//Cuando la página esté cargada ejecutará la función resaltar
$(document).ready(resaltar);

function jugar(token,idjuego,user, admin){
    //llamar a obtener turno
    var settingsobtT = {
        "url": juegos+"obtenerTurno/"+idjuego,
        "method": "GET",
        "timeout": 0,
      };
      $.ajax(settingsobtT).done(function (response) {
        data=JSON.parse(response);
        if(data[0].jugador==user){
            turno=data[0].turno;
        }else{
            turno=data[1].turno;
        }
      });
    if(turno==1){
        var req = new XMLHttpRequest();
        req.open('GET', consultajuego+idjuego, false); 
        req.send(null);
        if (req.status == 200){
            posInicial=req.responseText;
            var settings = {
                "url": tiradados,
                "method": "GET",
                "timeout": 0,
                "headers": {
                    "Authorization": "Bearer "+token
                },
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };
            $.ajax(settings).done(function (response) {
                ocultar(jug);
                var dado1=response[0];
                var dado2=response[1];
                var res=0;
                if(response[2]>3){
                    res=dado1+dado2;
                }else{
                    res=dado1-dado2;
                }
                posInicial[jug]=posInicial[jug]+res;
                posInicial[jug]=posInicial[jug]+res;
                
                var req = new XMLHttpRequest();
                req.open('GET', enviajuego+idjuego, false); 
                req.send(null);
                if (req.status == 200){
                    if(posInicial[jug]>=32){
                        //debe ganar
                        //arreglar, hay que mandar como PUT y agregarle el marcador
                        var settings = {
                            "url": "process.env.TORNEOS+\"partidas/\"+req.params.id",
                            "method": "PUT",
                            "timeout": 0,
                            "headers": {
                              "Authorization": "Bearer "+token,
                              "Content-Type": "application/json"
                            },
                            "data": JSON.stringify({"marcador":[1,0]}),
                          };
                        $.ajax(settings).done(function (response) {
                            window.locationf=interfaz+"/gano/Ganaste/"+user+"/"+admin;       
                        });
                    }else{
                        mostrar(jug);
                    }
                }
            });
            //cambiar turno
            var settingsobtT = {
                "url": obtieneturno+"cambiarTurno/"+idjuego,
                "method": "GET",
                "timeout": 0,
              };
              $.ajax(settingsobtT).done(function (response) {
                turno=response;
              });
        }else{
            //mostrar un error
        }
        
    }
    
}
function refrescar(){
    var req = new XMLHttpRequest();
    req.open('GET', consultajuego+idjuego, false); 
    req.send(null);
    if (req.status == 200){
        posInicial=req.responseText;
        ocultar(1);
        ocultar(2);
        mostrar(1);
        mostrar(2);
    }else{
        //mostrar un error
    }
}

function ocultar(jugador){
    if(jugador==1){
        document.getElementById(posInicial[0]+"1").style.display = 'none';
    }else{
        document.getElementById(posInicial[1]+"2").style.display = 'none';
    }    
}

function mostrar(jugador){
    if(jugador==1){
        document.getElementById(posInicial[0]+"1").style.display = 'block';
    }else{
        document.getElementById(posInicial[1]+"2").style.display = 'block';
    }    
}

function mostrarPos(pos1, pos2){
    document.getElementById(pos1+"1").style.display = 'block';
    document.getElementById(pos2+"2").style.display = 'block';  
}

function ocultarTodo(){
    document.getElementById("11").style.display = 'none';
    document.getElementById("21").style.display = 'none';
    document.getElementById("31").style.display = 'none';
    document.getElementById("41").style.display = 'none';
    document.getElementById("51").style.display = 'none';
    document.getElementById("61").style.display = 'none';
    document.getElementById("71").style.display = 'none';
    document.getElementById("81").style.display = 'none';
    document.getElementById("91").style.display = 'none';
    document.getElementById("12").style.display = 'none';
    document.getElementById("22").style.display = 'none';
    document.getElementById("32").style.display = 'none';
    document.getElementById("42").style.display = 'none';
    document.getElementById("52").style.display = 'none';
    document.getElementById("62").style.display = 'none';
    document.getElementById("72").style.display = 'none';
    document.getElementById("82").style.display = 'none';
    //aqui seguimos
}