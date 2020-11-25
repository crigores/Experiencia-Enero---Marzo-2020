//?FUNCIONES RELACIONADAS CON VALIDACIONES Y ACTUALIZACION DE CLIENTES
const { Actualizar_gestor, Actualizar_modulo,Actualizar_coordinacion, FindGestorBySalon} = require('../Reservaciones-func.js');

//? FUNCIONES RELACIONADAS CON EL MANEJO DE LA BDD
const bdd = require("../Reservaciones-bdd.js");

//? ARRAY QUE CONTIEN TODAS LAS MAQUINAS 
global.array   = require('../datosImportantes.js');


//? ACTUALIZA PAGINA DE COORDINACION PARA MOSTRAR PISO ADECUADO
 function ShowCoordinacion(socket, io){
    socket.on("COORDINACION-PISO", piso =>{
      let array = Actualizar_coordinacion(piso);
      io.to(socket.id).emit("COORDINACION-PISO", array); 

    });
 }
 

//? CAMBIA ESTATUS DE SALON (disponible -> reservacion) TANTO EL GESTOR COMO LAS MAQUINAS RESPECTIVAS
function OnCoordinacion_CambioStatus(socket, io){
  
  socket.on('COORDINACION-CAMBIOSTATUS', (piso,salon, tiempo, estatus, fn) =>{
    let extencion = 5;
    for (let i = 0; i < global.array.gestores.length; i++) {
        if(global.array.gestores[i]["SALON"] == salon)
        {
          let t = 0;
          if(isNaN(tiempo)) t = -1;
          else t = tiempo; 
          global.array.gestores[i]['STATUS'] = estatus;
          global.array.gestores[i]['TIEMPO'] = t;
          global.array.gestores[i]['EXTENCION'] = extencion;
          const array = Actualizar_gestor(global.array.gestores[i]['ID_USUARIO'],piso, salon);
          io.to(global.array.gestores[i]['ID_USUARIO']).emit('GESTOR-SALON',array);
        }
    }

    for (let i = 0; i < global.array.modulos.length; i++) {
      if(global.array.modulos[i]["PISO"] == piso)
      { 
   
        const array2 = Actualizar_modulo(piso, salon);
        io.to(global.array.modulos[i]['ID_USUARIO']).emit('MODULO-SALON',array2);
      }
    }

    for(let i=0; i < global.array.clientes[piso][salon].length; i++){
      if(global.array.clientes[piso][salon][i]["ID"] != null){
        //TODO OPTIMIZAR, EL TIEMPO, GESTOR YA TIENE ESTE DADO Y ES REDUNDANCIA
        io.to(global.array.clientes[piso][salon][i]["ID"]).emit('CLIENTE-CAMBIOSTATUS', estatus, tiempo, extencion);

      }
    }

    let array = Actualizar_coordinacion(piso);
    
    io.to(socket.id).emit("COORDINACION-PISO", array); 

    fn(true);
  });
}

////////////////////////////////////////////////////////////////////////
//ON COORDINACION ENCENDER GESTOR
function EncenderGestor(socket, io){
  socket.on('COORDINACION-ACCION', (piso, salon)=>{
    for (let i = 0; i < global.array.modulos.length; i++) {
      if(global.array.modulos[i]["PISO"] == piso)
      {
        bdd.ObtenerMac(salon,FindGestorBySalon(salon)).then((resultado)=>{
          io.to(global.array.modulos[i]["ID"]).emit('MODULO-WOL',resultado, true);
        });
      }
    }
  });
  
}


////////////////////////////////////////////////////////////////////////
//ON COORDINACION DISCONNECT
function OnDisconnect(socket){
  global.array.coordinacion = global.array.coordinacion.filter(c => c["ID"] !== socket.id);
}




module.exports = {
  OnCoordinacion_CambioStatus,
  ShowCoordinacion,
  EncenderGestor,
  OnDisconnect,
}