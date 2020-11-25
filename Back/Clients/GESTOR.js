//?FUNCIONES RELACIONADAS CON VALIDACIONES Y ACTUALIZACION DE CLIENTES
const {Maquina_Unica, Actualizar_gestor, Actualizar_coordinacion} = require('../Reservaciones-func.js');

//? FUNCIONES RELACIONADAS CON EL MANEJO DE LA BDD
const bdd = require("../Reservaciones-bdd.js");

//?OBJETOS CON INFORMACION QUE MOLDEA LOS DIFERENTES ARRAY QUE MANEJAN EL SERVIDOR
const {GESTOR_STATUS, STATUS} = require('../datosImportantes.js');

//? ARRAY QUE CONTIEN TODAS LAS MAQUINAS 
global.array   = require('../datosImportantes.js');

//?ESCUCHA A LA CONEXION DE LOS GESTORES AL SERVIDOR
function OnConnect(socket, io){ 
  socket.on("ONCONNECT-GESTOR",(ip,id,name,piso,salon, mac)=>{

      //VERIFICA QUE LA MAQUINA ES UNICA EN EL ARRAY DINAMICO
      if(Maquina_Unica(name, global.array.gestores)){
        bool = true;
        for (let i = 0 ; i < global.array.gestores.length; i++){    
          if(global.array.gestores[i]["MAQUINA"] == name){
            global.array.gestores[i]['ID'] = id;
            global.array.gestores[i]['IP'] = ip;
            global.array.gestores[i]['MAC'] =  mac;
            global.array.gestores[i]['STATUS'] =  GESTOR_STATUS.CLASES;
            global.array.gestores[i]['TIEMPO'] =  0;
            global.array.gestores[i]['EXTENCION'] =  0;
            bool = false;
            console.log(global.array.gestores[i]);
            break;
            
          }
        }
 
        //SI SE ACTUALIZA EL CLIENTE NO HAY NECESIDAD DE AGREGARLO DE NUEVO ;)
        if(bool)
          global.array.gestores.push({
            "IP":ip,
            "ID":id,
            "MAQUINA":name,
            "PISO":piso, 
            "SALON":salon,
            "STATUS":GESTOR_STATUS.CLASES, 
            "MAC":mac,
            "EXTENCION": 5
          });

        //VERIFICA QUE LA MAQUINA SEA UNICA ACTUALIZANDO O AGRGANDOLA
        bdd.Maquina_unica(name).then(result =>{
          if(result) 
            bdd.AgregarMaquina(name,id,ip,salon,piso,1,mac);
          else 
            bdd.ActualizarMaquina(name, id, ip,mac);                   
        });

        //ACTUALIZA PAGINA DE COORDINACION
        let array = Actualizar_coordinacion(piso);
        for(let i=0; i<global.array.coordinacion.length; i++){
          io.to(global.array.coordinacion[i]["ID"]).emit("COORDINACION-PISO", array);   
        }
      }else error(socket);
    });
}


//? ESCUCHA A LA DESCONEXION DE LOS GESTORES 
function OnDisconnect(socket, io){ 

  //CICLO QUE RECORRE TODOS LOS GESTORES BUSCANDO CUAL ES EL QUE SE DESCONECTO
  for (let i = 0 ; i < global.array.gestores.length; i++){
    if(global.array.gestores[i]["ID"] == socket.id){
      global.array.gestores[i]['IP'] = null;
      global.array.gestores[i]['ID'] = null;
      global.array.gestores[i]['STATUS'] = GESTOR_STATUS.APAGADA;
      global.array.gestores[i]['MAC'] = null;
      global.array.gestores[i]['TIEMPO'] =  0;
      global.array.gestores[i]['EXTENCION'] =  0;     
      let piso = global.array.gestores[i]['PISO'];
      let salon = global.array.gestores[i]['SALON'];
      //ACTUALIZA PAGINA DE COORDINACION
      let array = Actualizar_coordinacion(global.array.gestores[i]['PISO']);
      for(let k=0; k<global.array.coordinacion.length; k++){
        io.to(global.array.coordinacion[k]["ID"]).emit("COORDINACION-PISO", array);   
      }

      for(let j=0; j < global.array.clientes[piso][salon].length; j++)
      {
        io.to(global.array.clientes[piso][salon][i]["ID"]).emit('CLIENTE-STATUS',
                          STATUS.DISPONIBLE, 
                          global.array.clientes[piso][salon][i]["ESTUDIANTE"],
                          global.array.clientes[piso][salon][i]["MAQUINA"],
                          0,
                          global.array.gestores[i]["EXTENCION"]);
      }
      

      mostrar(global.array.gestores);
      return;
    }
  }
}

//? OBTIENE LA LISTA DE MAQUINAS DESDE LA BDD
async function GetMaquinas(piso, salon){
  return await bdd.GetMaquinas(piso, salon);
}

//? ACTUALIZA PAGINA DE GESTOR EN ESPECIFICO
function OnGestor_salon(socket, io){

  socket.on('GESTOR-SALON', (piso, salon)=>{

    const array = Actualizar_gestor(socket.id,piso, salon);

    if(array != null)
    {
      io.to(socket.id).emit('GESTOR-SALON',array);
    }
        
  });  
}

//? MUESTRA ERROR POR CONSOLA
function error(socket){
  console.log(
    "==============================\n"+
    "MAQUINA CON ESE NOMBRE YA SE ENCUENTRA\n"+
    "==============================\n"
    );
  socket.disconnect(true);
}

//? MUESTRA DATOS POR CONSOLA
function mostrar(array){
  console.clear();
  console.log("=====================================");
  console.log("==========Gestores totales===========");
  console.log("=====================================");
  console.log(array.filter(x => x.STATUS != GESTOR_STATUS.APAGADA));
}

module.exports = {
  OnConnect,
  OnDisconnect,
  OnGestor_salon,
  GetMaquinas
};