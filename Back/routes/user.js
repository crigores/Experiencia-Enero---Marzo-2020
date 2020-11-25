const express = require('express');
const users = express.Router();
//?INSTANCIAS DE FUNCIONES RELACIONADAS CON CADA UNO DE LOS TIPOS DE CLIENTES
const GESTOR = require('../Clients/GESTOR.js');
//?OBJETOS CON INFORMACION QUE MOLDEA LOS DIFERENTES ARRAY QUE MANEJAN EL SERVIDOR
const {GESTOR_STATUS} = require('../datosImportantes.js');

const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
users.use(bodyParser.json());
//? FUNCIONES RELACIONADAS CON EL MANEJO DE LA BDD
const bdd = require("../Reservaciones-bdd.js");
//? ARRAY QUE CONTIEN TODAS LAS MAQUINAS 
global.array   = require('../datosImportantes.js');


users.use(cors("http://localhost:3000"));
const SECRET_KEY = 'licrasdedigimon';


//POST REQUEST DE LA PAGINA DE REGISTRO
users.post('/registro',(req,res)=>{
  console.log("typeUser: "+req.body.typeUser)
  let hash = {username: req.body.username, password: '', typeUser: req.body.typeUser};
  bcrypt.hash(req.body.password, 8)
    .then(hashedPassword => {
        hash.password = hashedPassword;
    })
    .then(()=>{
       bdd.Insert_usuario(hash).then((data)=>{
        if(data)
          console.log("REGISTRADO");
        else
          console.log("ERROR linea 66 user.js");
       });
    });

})


//POST REQUEST DE LA PAGINA DE LOGIN
users.post('/login',(req, res) => {
    const { username, password } = req.body;

    //VERIFICA SI EL NOMBRE DE USUARIO EXISTE EN LA BASE DE DATOS
    bdd.verificarUsario(req.body.username)
      .then(user => {
        
        //VERIFICA SI LOS DATOS QUE ARROJO LA BASE DE DATOS NO SON NULOS
        if (user[1][0] === null) {
          res.status(401).json({
            sucess: false,
            token: null,
            err: 'Credenciales Invalidas'
          });
        }

        //COMPARA LA CONTRASEÑA ENCRIPTADA DE LA BASE DE DATOS CON LA TRAIDA DEL FRONT-END
        bcrypt.compare(password, user[1][0].password,  (err, result) => {
          //SI LA CONTRASEÑA Y EL HASH COINCIDEN
          if (result === true) { 
              verificarRole(user[1][0].idTipoUsuario,req.ip.substring(7, req.ip.length)).then(result =>{
                if(result[0]){

                  addusuario(user[1][0].idTipoUsuario,req.ip.substring(7, req.ip.length));
                  const gestor = verificarSalonGestor(req.ip.substring(7, req.ip.length));
                  //console.clear();

                  let token = jwt.sign(
                    {
                    role : user[1][0].idTipoUsuario,
                    valor: result[1],
                    },
                    SECRET_KEY,
                    { expiresIn: '4h' }); // Signing the token
                  
                  res.json({
                    sucess: true,
                    err: null,
                    token
                  });
                  
              } else {
                res.status(401).json({
                sucess: false,
                token: null,
                err: 'ESTA MAQUINA NO CUENTA CON LOS PERMISOS NECESARIOS PARA PODER INTRODUCIRSE EN EL SISTEMA ADMINISTRATIVO DE INTERCONEXIONES, MAGI;'
            });
              }

              });
              //VERIFICA SI LA MAQUINA QUE SE ESTA CONECTANDO ESTA AÑADIDA EN LA LISTA DE TIPO DE MAQUINAS
              
          }
          //SI LA CONTRASEÑA Y EL HASH NO COINCIDEN
          else {
            console.log("La contraseña y el hash no coinciden!");
            res.status(401).json({
              sucess: false,
              token: null,
              err: 'La contraseña y el hash no coinciden!'
            });
          }
        });
      })

})

users.post('/refreshToken', (req, res) => {
  let IP = req.ip.substring(7, req.ip.length);

  if (verficiarUsuarioConectado(IP)[0]) 
  {
    const usuario = verficiarUsuarioConectado(IP)[1];
    verificarRole(usuario["ROLE"],usuario["IP"]).then(result => {
      
      const newToken = jwt.sign(
        {role: usuario["ROLE"], valor: result[1]},
          SECRET_KEY,
        { expiresIn: '4h' }
      );
        res.json({success: true, err:null, newToken});
        });
        
    } 
    else 
    {
      console.log("ENTRE AQUI :( linea 161 user.js")
        res.status(401).json({sucess: false, token: null, err: 'La contraseña y el hash no coinciden!'});
    }

});

users.post('/socketvalidation', (req, res) => {
  addSocketID_to_usuario(req.ip.substring(7, req.ip.length),req.body.role, req.body.socketID);
  res.json({success: true, err:null});

});


async function verificarRole(role,ip){
  let pisito, saloncito;
  switch(role){

    case global.array.ROLES_USUARIOS.COORDINACION: //COORDINANDOR
        return [true,{nombre: role.nombre, pisos: Object.keys(global.array.clientes)}];        
      break;

    case global.array.ROLES_USUARIOS.MODULO: //MODULO
      if(global.array.modulos.length > 0)
      {
        for(let i = 0 ; i < global.array.modulos.length ; i++){
          //console.log(global.array.modulos[i]["PISO"]);
          if(ip == global.array.modulos[i]["IP"]){ 
            const pis = global.array.modulos[i]["PISO"] ;
            return [true, {piso: global.array.modulos[i]["PISO"], salones:Object.keys(global.array.clientes[pis])}];
          }
        }
      }
      mostrar("NO HAY MODULO CONECTADO");
      return [false, null];
      break;

    case global.array.ROLES_USUARIOS.GESTOR: //GESTOR

    if(global.array.gestores.length > 0)
      {
        for(let i = 0 ; i < global.array.gestores.length ; i++){
          if(ip === global.array.gestores[i]["IP"] && global.array.gestores[i]["STATUS"] == GESTOR_STATUS.RESERVACION){
            pisito = global.array.gestores[i]["PISO"];
            saloncito = global.array.gestores[i]["SALON"];
            const maquinitas = await GESTOR.GetMaquinas(saloncito);
            return [true,{piso:global.array.gestores[i]["PISO"], salon:global.array.gestores[i]["SALON"], maquinas: maquinitas}];
          }
        }
      }  
      //mostrar("NO HAY GESTOR CONECTADO");
      return [false, null];
      break;

    default: //DEFAULT
      return [false, null];
      break;
  }
}


function addusuario(role, ip){
  for(let i = 0; i< global.array.gestores.length; i++){
    if (ip === global.array.gestores[i]["IP"]) {
      global.array.gestores[i]["ROLE"] = role;
      return;
    }
  }
  for(let j = 0; j< global.array.modulos.length; j++){
    if (ip === global.array.modulos[j]["IP"]) {
      global.array.modulos[j]["ROLE"] = role;
      return;
    }
  }
}

function addSocketID_to_usuario(ip, role, SocketID){

  if(role === global.array.ROLES_USUARIOS.GESTOR )
  {
    for(let i = 0; i< global.array.gestores.length; i++){

      if (ip === global.array.gestores[i]["IP"]) {
        global.array.gestores[i]['ID_USUARIO'] = SocketID;
        return;
      }
    }
  }
  else if(role == global.array.ROLES_USUARIOS.MODULO)
  {
    for(let j = 0; j< global.array.modulos.length; j++){
      if (ip === global.array.modulos[j]["IP"]) {

        global.array.modulos[j]['ID_USUARIO'] = SocketID;
        return;
      }
    }
  }

  else if(role == global.array.ROLES_USUARIOS.COORDINACION)
  {
    if(global.array.coordinacion.length < 1)
    {
      global.array.coordinacion.push({
        "IP": ip,
        "ID": SocketID,
      });
      return;
    }



    for(let i=0; i<global.array.coordinacion.length; i++)
    {
      if(global.array.coordinacion[i]["IP"] == ip)
      {
        global.array.coordinacion[i]["ID"] = SocketID;
        return;
      }
    }
    global.array.coordinacion.push({
      "IP": ip,
      "ID": SocketID,
    });

  }
}

function verficiarUsuarioConectado(ip)
{

  for(let i = 0; i< global.array.gestores.length; i++){
    if (ip === global.array.gestores[i]["IP"]) {

      return [true, global.array.gestores[i]];
    }
  }
  for(let j = 0; j< global.array.modulos.length; j++){
    if (ip === global.array.modulos[j]["IP"]) {

      return [true, global.array.modulos[j]];
    }
  }
  return [false, null];
}

function verificarSalonGestor(ip){

   for(let i = 0 ; i < global.array.gestores.length ; i++)
   {
          if(ip == global.array.gestores[i]["IP"])
          {  
            return global.array.gestores[i];
          }
    }
}
////////////////////////////////////////////////////////////
function mostrar(texto){
  console.clear();
  console.log("=====================================");
  console.log(`========== ${texto} ===========`);
  console.log("=====================================");
}

module.exports = users;
