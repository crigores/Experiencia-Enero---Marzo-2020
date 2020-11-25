//? FUNCIONES RELACIONADAS CON EL MANEJO DE LA BDD
const bdd = require("../Reservaciones-bdd.js");

//?FUNCIONES RELACIONADAS CON VALIDACIONES Y ACTUALIZACION DE CLIENTES
const { Maquina_Unica,Actualizar_modulo,Actualizar_coordinacion } = require("../Reservaciones-func");

//? ARRAY QUE CONTIEN TODAS LAS MAQUINAS 
global.array   = require('../datosImportantes.js');

//?OBJETOS CON INFORMACION QUE MOLDEA LOS DIFERENTES ARRAY QUE MANEJAN EL SERVIDOR
const {MODULO_STATUS} = require('../datosImportantes.js');

//? ESCUCHA CONEXION DE MODULOS AL SERVIDOR
function OnConnect(socket,io) { 
    socket.on("CONEXION-MODULO", (ip,id,name,piso, mac) => {

      //VERIFICA SI ES LA UNICA MAQUINA CON ESE NOMBRE EN LA LISTA DINAMICA
      if(Maquina_Unica(name,  global.array.modulos)){
        bool = true;
        //SI EL MODULO YA ESTA EN LA LISTA DINAMICA ACUTALIZA SUS DATOS
        for (let i = 0 ; i < global.array.modulos.length; i++){    
          if(global.array.modulos[i]["PISO"] == piso){
            global.array.modulos[i]['ID'] = id;
            global.array.modulos[i]['IP'] = ip;
            global.array.modulos[i]['MAC'] =  mac;
            global.array.modulos[i]['ID_USUARIO'] = '';
            global.array.modulos[i]['STATUS']  = MODULO_STATUS.ENCENDIDO;
            bool = false;
            break;  
          }
        }
        
        //AGREGA A LA LISTA DINAMICA EL MODULO QUE SE ACABA DE CONECTAR
        if(bool)
          global.array.modulos.push({"MAQUINA": name,"PISO":piso,"IP":ip,"ID":id, "MAC": mac,"STATUS":MODULO_STATUS.ENCENDIDO });
        bdd.VerificarExistencia(name).then(result =>{
          if(!result) 
            bdd.AgregarMaquina(name,id,ip,"PASILLO",piso,3,mac);
          else 
            bdd.ActualizarMaquina(name,id,ip,mac); 
        });

        //MUESTRA EL ARRAY DE MODULOS EN LA CONSOLA
        mostrar(global.array.modulos);
        let array = Actualizar_coordinacion(piso);
        for(let i=0; i<global.array.coordinacion.length; i++)
          io.to(global.array.coordinacion[i]["ID"]).emit("COORDINACION-PISO", array); 

      }else error(socket);
    });  
}

//? ESCUCHA A LA PAGINA PARA DEVOLVERLE ARRAY CON LOS DATOS DEL SALON AL MODULO
function OnModulo_salon(socket, io){
  socket.on('MODULO-SALON', (piso, salon)=>{
  
    for(let i =0; i < global.array.modulos.length; i++){
      if(socket.id == global.array.modulos[i]['ID_USUARIO'])
      {
        for (let k = 0; k < global.array.gestores.length; k++) {
          if(global.array.gestores[k]["SALON"] == salon)
          {
            //ACTUALIZA PAGINA DE MODULO
            const array = Actualizar_modulo(piso, salon);
            io.to(socket.id).emit('MODULO-SALON',array);
            return;
          }
        }
        
      }
    }
  });
}

//? ENVIA MENSAJES A MODULOS ESPECIFICOS
function OnModulo_msj(socket, io){
  socket.on("MODULO-MSJ", (piso, msj, fn)=>{
    for(let i =0; i < global.array.modulos.length; i++){
      if(global.array.modulos[i]["PISO"] == piso){ 
        io.to(global.array.modulos[i]['ID_USUARIO']).emit('MODULO-MSJ',msj);
        fn(true); //CALLBACK PARA VERIFICAR QUE SE REALIZO EL PROCESO
        return;
      }
    }
    fn(false); //CALLBACK PARA VERIFICAR QUE SE NO REALIZO EL PROCESO
    return;
  });
}


//? ESCUCHA CUANDO SE DESCONECTA UN MODULO DEL SERVIDOR
function OnDisconnect(socket,io){

    //CICLO QUE BUSCA EL MODULO QUE DESCONECTO
    for (let i = 0 ; i < global.array.modulos.length; i++){
      if(global.array.modulos[i]["ID"] == socket.id){
        global.array.modulos[i]['ID']   = null;
        global.array.modulos[i]['IP']   = null;
        global.array.modulos[i]['MAC']  =  null;
        global.array.modulos[i]['STATUS']  = MODULO_STATUS.APAGADA;      
        mostrar(global.array.modulos);

        //ACTUALIZA PAGINA DE COORDINACION
        let array = Actualizar_coordinacion(global.array.modulos[i]["PISO"]);
        for(let i=0; i<global.array.coordinacion.length; i++)
          io.to(global.array.coordinacion[i]["ID"]).emit("COORDINACION-PISO", array);
        return;
      }
    }
}

//?MOSTRAR ERROR POR CONSOLA
function error(socket){
  console.log(
    "==============================\n"+
    "MAQUINA CON ESE NOMBRE YA SE ENCUENTRA\n"+
    "==============================\n"
    );
    socket.disconnect(true);
}

//?MOSTRAR DATOS POR CONSOLA
function mostrar(array){
  console.log("=====================================");
  console.log("==========Modulos totales============");
  console.log("=====================================");
  console.log(array);
}

  module.exports = {
    OnConnect,
    OnDisconnect,
    OnModulo_salon,
    OnModulo_msj,
  };