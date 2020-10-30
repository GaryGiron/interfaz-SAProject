var express = require('express');
var request = require('request');
var env = require('node-env-file'); // .env file
env(__dirname + '/.env');
var router = express.Router();
var token;
var options = {
  method: 'GET',
  url: process.env.JWT,  
};
/* GET home page. */
router.get('/', function(req, res, next) {
  request(options, function (error, response, body) {
    if (error) console.log("Error: "+error);
        var myJson = JSON.parse(body);
        token = myJson["token"];
        console.log(token);
        res.render('inicio', { title: 'Login' , e:""});
    });
});

router.post('/logueo', function(req, res, next) {
  //consumo de servicios
  //MENU PRINCPIPAL
  var options = {
    'method': 'GET',
    'url': process.env.USUARIOS+"/login?email="+req.body.user+"&password="+req.body.pass,
    'headers': {
      'Authorization': 'Bearer '+token
    }
  };
  request(options, function (error, response) {
    if (error) {
      console.error(error)
      res.render('inicio', { title: 'Login', e: error});
    }
    console.log(`statusCode: ${response}`)
    console.log(response.body)
    var data = JSON.parse(response.body);
    res.render('index', { title: 'Generador de Juegos y Torneos', e:"", user:data.id, admin:data.administrador});
  });
  
 /* request.get(process.env.USUARIOS+"/login?email="+req.body.user+"&password="+req.body.pass, (error, res2, body) => {
  if (error) {
    console.error(error)
    res.render('inicio', { title: 'Login', e: error});
    }
  console.log(`statusCode: ${res2.statusCode}`)
  console.log(body)
  res.render('index', { title: 'Generador de Juegos y Torneos', e:"", user:req.body.user, admin:body.admin});
  })*/
});
//USUARIOS
router.get('/users/:user/:admin', function(req, res, next) {
  var options = {
    'method': 'GET',
    'url': process.env.USUARIOS+"/jugadores",
    'headers': {
      'Authorization': 'Bearer '+token
    }
  };
  request(options, function (error, response) {
    if (error) {
      console.error(error)
      res.render('index', { title: 'Generador de Juegos y Torneos', e: error, user:req.params.user, admin:req.params.admin});
      }
    console.log(`statusCode: ${response.statusCode}`)
    console.log(response.body)
    //res.render('usuario', { title: 'Administrador de usuarios', usuarios:response.body, e:"", user:req.params.user, admin:req.params.admin});
  });
  /*request.get(process.env.USUARIOS+"/jugadores", (error, res2, body) => {
    if (error) {
      console.error(error)
      res.render('index', { title: 'Generador de Juegos y Torneos', e: error, user:req.params.user, admin:req.params.admin});
      }
    console.log(`statusCode: ${res2.statusCode}`)
    console.log(body)
    res.render('usuario', { title: 'Administrador de usuarios', usuarios:body, e:"", user:req.params.user, admin:req.params.admin});
    })*/
});

router.get('/newuser/:user/:admin', function(req, res, next) {
  res.render('newuser', { title: 'Creacion de Usuarios', e:"", user:req.params.user, admin:req.params.admin});
});

router.post('/crearuser/:user/:admin',function(req, res, next) {
  if(req.params.admin){
    var options = {
      'method': 'POST',
      'url': process.env.USUARIOS+"/jugadores",
      'headers': {
        'Authorization': 'Bearer '+token
      },
      json: {
        'apellidos': req.body.apellido,
        'correo': req.body.correo,
        'password': req.body.pass,
        'administrador': req.body.admin
      }
    };
    request(options, function (error, response) {
      if (error) {
        console.error(error)
        res.render('newuser', { title: 'Creacion de Usuarios', e:error, user:req.params.user, admin:req.params.admin});
      }
      console.log(`statusCode: ${res2.statusCode}`)
      console.log(body)
      res.render('index', { title: 'Generador de Juegos y Torneos', e: "Usuario Creado Exitosamente", user:req.params.user, admin:req.params.admin});
    });
  }else{
    res.render('newuser', { title: 'Creacion de Usuarios', e:"El usuario no puede crear usuarios porque no es administrador", user:req.params.user, admin:req.params.admin});
  }
    /*request.post(process.env.USUARIOS+"/jugadores", {
  json: {
      nombres: req.body.nombre,
      apellidos: req.body.apellido,
      correo: req.body.correo,
      password: req.body.pass,
      administrador: req.body.admin
    }
  }, (error, res2, body) => {
  if (error) {
      console.error(error)
      res.render('newuser', { title: 'Creacion de Usuarios', e:error, user:req.params.user, admin:req.params.admin});
    }
  console.log(`statusCode: ${res2.statusCode}`)
  console.log(body)
  res.render('index', { title: 'Generador de Juegos y Torneos', e: "Usuario Creado Exitosamente", user:req.params.user, admin:req.params.admin});
  //res.render('usuario', { title: 'Administrador de usuarios', usuarios:[], e:"Usuario Creado Exitosamente"});
  })*/
});

router.get('/editauser/:id/:user/:admin', function(req, res, next) {
  if(req.params.admin){
    var options = {
      'method': 'GET',
      'url': process.env.USUARIOS+"/jugadores",
      'headers': {
        'Authorization': 'Bearer '+token
      }
    };
    request(options, function (error, response) {
      if (error) {
        console.error(error)
        res.render('index', { title: 'Generador de Juegos y Torneos', e: error, user:req.params.user, admin:req.params.admin});
        }
      console.log(`statusCode: ${res2.statusCode}`)
      console.log(body)
      res.render('detalle', { title: 'Actualizacion de usuarios', usuarios:body, e:"", user:req.params.user, admin:req.params.admin});
    });
  }else{
    res.render('index', { title: 'Generador de Juegos y Torneos', e: "El usuario no puede editar otros usuarios porque no es administrador", user:req.params.user, admin:req.params.admin});
  }
  /*request.get(process.env.USUARIOS+"/jugadores/"+req.params.id, (error, res2, body) => {
    if (error) {
      console.error(error)
      res.render('index', { title: 'Generador de Juegos y Torneos', e: error, user:req.params.user, admin:req.params.admin});
      }
    console.log(`statusCode: ${res2.statusCode}`)
    console.log(body)
    res.render('detalle', { title: 'Actualizacion de usuarios', usuarios:body, e:"", user:req.params.user, admin:req.params.admin});
    })*/
});

router.post('/updateuser/:user/:admin',function(req, res, next) {
  if(req.params.admin){
    var options = {
      'method': 'PUT',
      'url': process.env.USUARIOS+"/jugadores",
      'headers': {
        'Authorization': 'Bearer '+token
      },
      formData: {
        'nombres': req.body.nombre,
        'apellidos': req.body.apellido,
        'correo': req.body.correo,
        'password': req.body.pass
      }
    };
    request(options, function (error, response) {
      if (error) {
        console.error(error)
        res.render('index', { title: 'Generador de Juegos y Torneos', e: error, user:req.params.user, admin:req.params.admin});
      }
      console.log(`statusCode: ${res2.statusCode}`)
      console.log(body)
      res.render('index', { title: 'Generador de Juegos y Torneos', e: "Usuario Editado Exitosamente", user:req.params.user, admin:req.params.admin});
    });
  }else{
    res.render('index', { title: 'Generador de Juegos y Torneos', e: "El usuario no puede editar otros usuarios porque no es administrador", user:req.params.user, admin:req.params.admin});
  }
  /*request.put(process.env.USUARIOS+"/jugadores/"+req.body.id, {
  json: {
      nombres: req.body.nombre,
      apellidos: req.body.apellido,
      correo: req.body.correo,
      password: req.body.pass
    }
  }, (error, res2, body) => {
  if (error) {
      console.error(error)
      res.render('index', { title: 'Generador de Juegos y Torneos', e: error, user:req.params.user, admin:req.params.admin});
    }
  console.log(`statusCode: ${res2.statusCode}`)
  console.log(body)
  res.render('index', { title: 'Generador de Juegos y Torneos', e: "Usuario Editado Exitosamente", user:req.params.user, admin:req.params.admin});
  //res.render('usuario', { title: 'Administrador de usuarios', usuarios:[], e:"Usuario Creado Exitosamente"});
  })*/
});

///searchtorneo
router.get('/torneos/:id/:user/:admin', function(req, res, next) {
  var options = {
    'method': 'GET',
    'url': process.env.USUARIOS+"/jugadores",
    'headers': {
      'Authorization': 'Bearer '+token
    }
  };
  request(options, function (error, response) {
    if (error) {
      console.error(error)
      res.render('index', { title: 'Generador de Juegos y Torneos', e: error, user:req.params.user, admin:req.params.admin});
      }
    console.log(`statusCode: ${res2.statusCode}`)
    console.log(body)
    res.render('torneolist', { title: 'Lista de Torneos Jugables', usuarios:body, e:"", user:req.params.user, admin:req.params.admin});
  });
  /*request.get(process.env.torneos+"/torneos/"+req.params.id, (error, res2, body) => {
    if (error) {
      console.error(error)
      res.render('index', { title: 'Generador de Juegos y Torneos', e: error, user:req.params.user, admin:req.params.admin});
      }
    console.log(`statusCode: ${res2.statusCode}`)
    console.log(body)
    res.render('torneolist', { title: 'Lista de Torneos Jugables', usuarios:body, e:"", user:req.params.user, admin:req.params.admin});
    })*/
});

//crearTorneos
router.post('/creatorneo/:user/:admin',function(req, res, next) {
  if(req.params.admin){
    var options = {
      'method': 'POST',
      'url': process.env.TORNEOS+"/createTorneo",
      'headers': {
        'Authorization': 'Bearer '+token
      },
      formData: {
        'nombre': req.body.nombre,
        'id1': req.body.id1,
        'id2': req.body.id2,
        'id3': req.body.id3,
        'id4': req.body.id4,
        'id5': req.body.id5,
        'id6': req.body.id6,
        'id7': req.body.id7,
        'id8': req.body.id8,
        'id9': req.body.id9,
        'id10': req.body.id10,
        'id11': req.body.id11,
        'id12': req.body.id12,
        'id13': req.body.id13,
        'id14': req.body.id14,
        'id15': req.body.id15,
        'id16': req.body.id16
      }
    };
    request(options, function (error, response) {
      if (error) {
        console.error(error)
        res.render('torneos', { title: 'Administracion de Torneos', e:error, user:req.params.user, admin:req.params.admin});
      }
      console.log(`statusCode: ${res2.statusCode}`)
      console.log(body)
      res.render('index', { title: 'Generador de Juegos y Torneos', e: "Torneo Creado Exitosamente", user:req.params.user, admin:req.params.admin});
    });  
  }else{
    res.render('index', { title: 'Generador de Juegos y Torneos', e: "El Usuario no puede crear torneos porque no es administrador", user:req.params.user, admin:req.params.admin});
  }
  /*request.post(process.env.USUARIOS+"/creatorneo", {
  json: {
      nombre: req.body.nombre,
      id1: req.body.id1,
      id2: req.body.id2,
      id3: req.body.id3,
      id4: req.body.id4,
      id5: req.body.id5,
      id6: req.body.id6,
      id7: req.body.id7,
      id8: req.body.id8,
      id9: req.body.id9,
      id10: req.body.id10,
      id11: req.body.id11,
      id12: req.body.id12,
      id13: req.body.id13,
      id4: req.body.id14,
      id15: req.body.id15,
      id16: req.body.id16,
    }
  }, (error, res2, body) => {
  if (error) {
      console.error(error)
      res.render('torneos', { title: 'Administracion de Torneos', e:error, user:req.params.user, admin:req.params.admin});
    }
  console.log(`statusCode: ${res2.statusCode}`)
  console.log(body)
  res.render('index', { title: 'Generador de Juegos y Torneos', e: "Torneo Creado Exitosamente", user:req.params.user, admin:req.params.admin});
  //res.render('usuario', { title: 'Administrador de usuarios', usuarios:[], e:"Usuario Creado Exitosamente"});
  })*/
});

router.get('/torneos/:user/:admin', function(req, res, next) {
  res.render('torneos', { title: 'Administracion de Torneos', e: "", user:req.params.user, admin:req.params.admin});
});

router.get('/jugar/:id/:user/:admon/:pos1/:pos2', function(req, res, next) {
  res.render('tablero', { title: 'Sum Swamp', id:req.params.id, user:req.params.user, admin:req.params.admin});
});

router.get('/simular/:id/:user/:admon', function(req, res, next) {
  player1=1;
  player2=1;
  cont=1;
  resultado="";
  console.log("===========================================================");
  console.log("|                    Inicia Partida                       |");
  console.log("===========================================================");
  while(player1<32 && player2<32){
    if(cont%2==0){
        player2=player2+(Math.random() * (13 - 1) + 1);
        console.log("Jugador 2 -> "+player2);
        resultado=resultado+cont+","+player1+","+player2+";";
    }else{
        player1=player1+(Math.random() * (13 - 1) + 1);
        console.log("Jugador 1 -> "+player1);
        resultado=resultado+cont+","+player1+","+player2+";";
    }
    cont++;
  }
  var optionssim = {
    'method': 'POST',
    'url': process.env.JUEGOS+"/simular",
    'headers': {
      'Authorization': 'Bearer '+token
    },
    json: {
      'data': resultado
    }
  };
  request(optionssim, function (error, response) {
    marcador=[]
    if(player1>=32){
      marcador=[1,0]
    }else{
      marcador=[0,1]
    }
    var optionsG = {
      'method': 'PUT',
      'url': process.env.TORNEOS+"partidas/"+req.params.id,
      'headers': {
        'Authorization': 'Bearer '+token
      },
      body: JSON.stringify({"marcador":[1,0]})
    };
    request(optionsG, function (error, response) {
      if (error) console.log("Error: "+error);
      console.log(response.body);
      console.log("Se envio el resultado");
    });
    res.render('tablero', { title: 'Sum Swamp', id:req.params.id, user:req.params.user, admin:req.params.admin});
  });
});


router.get('/jugar', function(req, res, next) {
  res.render('tablero', { title: 'Sum Swamp', id:"prueba", user:"admin", admin:true});
});

router.get('/gano/:msj/:user/:admin', function(req, res, next){
  res.render('index', { title: 'Generador de Juegos y Torneos', e: req.params.msj+" esta partida", user:req.params.user, admin:req.params.admin});
});

router.get('/turno/:id/:user/:admon', function(req, res, next) {
  var turno=0;
  var posicion=0;
  var pos1=0;
  var pos2=0;
  var optionsturn = {
    'method': 'GET',
    'url': process.env.JUEGOS+'obtenerTurno/'+req.params.id+"/"+req.params.user
  };
  request(optionsturn, function (error, response) {
    if (error) console.log("Error: "+error);
    console.log(response.body);
    turno=JSON.parse(response.body).turno;
    console.log(turno);
    if(turno==1){
      console.log("entro al turno")
      var optionspos = {
        'method': 'GET',
        'url': process.env.JUEGOS+'/obtenerPosicion/'+req.params.id
      };
      request(optionspos, function (error2, response2) {
        if (error2) console.log("Error: "+error2);
        console.log(response2.body);
        posicion=JSON.parse(response2.body);
        pos1=posicion[0].posicion;
        pos2=posicion[1].posicion;
        var optionsdado = {
          'method': 'GET',
          'url': process.env.DADOS+'/tirar/3',
          'headers': {
            'Authorization': 'Bearer '+token
          }
        };
        request(optionsdado, function (error3, response3) {
          if (error3) console.log("Error: "+error3);
          console.log(response3.body);
          var info = JSON.parse(response3.body).dados;
          console.log(info[0]);
          console.log(info[1]);
          console.log(info[2]);
          var posres=0;
          if(req.params.user==posicion[0].jugador){
            if(info[2]>3){
              var suma=Math.abs(info[0]+info[1])
              console.log("suma: "+suma);
              pos1= Number(pos1) + suma;
            }else{
              var suma=Math.abs(info[0]-info[1])
              console.log("resta: " +suma);
              pos1= Number(pos1) + suma;
            }
            posres=pos1;
            if(posres>32){
              var optionsGanador = {
                'method': 'POST',
                'url': process.env.TORNEOS+'/guardarPosicion/'+req.params.id,
                'headers': {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({"marcador":[1]})
              };
              request(optionsGanador, function (error6, response6) {
                if (error6) console.log("Error: "+error6);
                console.log(response6.body);
              });
              var optionsFin = {
                'method': 'POST',
                'url': process.env.JUEGOS+'/finalizarPartida/'+req.params.id
              };
              request(optionsFin, function (error7, response7) {
                if (error7) console.log("Error: "+error7);
                console.log(response7.body);
              });
            }
          }else{
            if(info[2]>3){
              var suma=Math.abs(info[0]+info[1])
              console.log("suma: "+suma);
              pos2= Number(pos2) + suma;
            }else{
              var suma=Math.abs(info[0]-info[1])
              console.log("resta: " +suma);
              pos2= Number(pos2) + suma;
            }
            posres=pos2;
            if(posres>32){
              var optionsGanador = {
                'method': 'POST',
                'url': process.env.TORNEOS+'/guardarPosicion/'+req.params.id,
                'headers': {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({"marcador":[2]})
              };
              request(optionsGanador, function (error6, response6) {
                if (error6) console.log("Error: "+error6);
                console.log(response6.body);
              });
              var optionsFin = {
                'method': 'POST',
                'url': process.env.JUEGOS+'finalizarPartida/'+req.params.id
              };
              request(optionsFin, function (error7, response7) {
                if (error7) console.log("Error: "+error7);
                console.log(response7.body);
              });
            }
          }
          console.log("posicion jug 1: "+pos1);
          console.log("posicion jug 2: "+pos2);

          var optionsSavePos = {
            'method': 'POST',
            'url': process.env.JUEGOS+'guardarPosicion/'+req.params.id+'/'+req.params.user+'/'+posres
          };
          request(optionsSavePos, function (error4, response4) {
            if (error4) console.log("Error: "+error4);
            console.log(response4.body);
            var optionsCambiaTurn = {
              'method': 'POST',
              'url': process.env.JUEGOS+'cambiarTurno/'+req.params.id+'/'+req.params.user
            };
            request(optionsCambiaTurn, function (error5, response5) {
              if (error5) console.log("Error: "+error5);
              console.log(response5.body);
            });
          });
        });
      }); 
    }
  });
  //res.redirect(200, 'http://localhost:3100/turno/'+req.params.id,+'/'+req.params.user+'/'+req.params.admin+'?pos1='+posicion+'&pos2='+posicion);
  res.render('tablero', { title: 'Sum Swamp', id:req.params.id, user:req.params.user, admin:req.params.admin});
});


module.exports = router;
