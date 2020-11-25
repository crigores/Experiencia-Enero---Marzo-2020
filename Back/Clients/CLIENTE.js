//?FUNCIONES RELACIONADAS CON VALIDACIONES Y ACTUALIZACION DE CLIENTES
const {Maquina_Unica, Actualizar_gestor, Actualizar_modulo} = require('../Reservaciones-func.js');

//? FUNCIONES RELACIONADAS CON EL MANEJO DE LA BDD
const bdd = require("../Reservaciones-bdd.js");

//? ARRAY QUE CONTIEN TODAS LAS MAQUINAS 
global.array  = require('../datosImportantes.js');

//?OBJETOS CON INFORMACION QUE MOLDEA LOS DIFERENTES ARRAY QUE MANEJAN EL SERVIDOR
const {STATUS, GESTOR_STATUS} = require('../datosImportantes.js');


//? ESCUCHA A TODOS LOS CLIENTES QUE SE ESTAN CONECTANDO AL SERVIDOR
function OnConnect(socket, io){ 

    socket.on("CLIENTE",(id,name,ip, piso, salon,mac, fn)=>{

      //COMPRUEBA SI EXISTE EL SALON DE LA MAQUINA EN LA LISTA DINAMICA SINO LA CREA
      if(!(piso in (global.array.clientes))){
        let temp = {};
        temp[salon] = [];
        global.array.clientes[piso] = temp;
      }
     
      //COMPRUEBA QUE LA MAQUINA SEA UNICA EN LA LISTA DE DINAMICA
      if(Maquina_Unica(name,global.array.clientes[piso][salon])){
        bool = true;
        let estado;
        //SI EL MODULO YA ESTA EN LA LISTA DINAMICA ACUTALIZA SUS DATOS
        for (let i = 0 ; i < global.array.clientes[piso][salon].length; i++){    
          if(global.array.clientes[piso][salon][i]["MAQUINA"] == name){
            global.array.clientes[piso][salon][i]['ID'] = id;
            global.array.clientes[piso][salon][i]['IP'] = ip;
            global.array.clientes[piso][salon][i]['MAC'] =  mac;
            global.array.clientes[piso][salon][i]['STATUS'] =  STATUS.DISPONIBLE;
            bool = false;
            break;  
          }
        }      
          //AGREGAR CLIENTE A LISTAR VOLATIL 
          if(bool)
            global.array.clientes[piso][salon].push({
              "ID":id, 
              "MAQUINA":name, 
              "STATUS": STATUS.DISPONIBLE, 
              "ESTUDIANTE": null, 
              "MAC": mac, 
              "IP":ip
            });
            

              //ACTUALIZA PAGINA DE GESTOR
              for(let l =0; l < global.array.gestores.length; l++){
                  if(global.array.gestores[l]["SALON"] == salon)
                  {
                    let array = Actualizar_gestor(global.array.gestores[l]['ID_USUARIO'],piso, salon);
                    io.to(global.array.gestores[l]['ID_USUARIO']).emit('GESTOR-SALON',array);
                    estado = global.array.gestores[l]['STATUS'];
                    io.to(socket.id).emit('CLIENTE',global.array.gestores[l]['STATUS'], STATUS.DISPONIBLE);
                  }      
              }

              //ACTUALIZA PAGINA DE MODULO
              for (let m = 0; m < global.array.modulos.length; m++) {
		            if(global.array.modulos[m]["PISO"] == piso)
		            { 
		              let array = Actualizar_modulo(piso, salon);
		              io.to(global.array.modulos[m]['ID_USUARIO']).emit('MODULO-SALON',array);
		            }
   				} 
          //COMPRUEBA EN LA BDD SI LA MAQUINA ES UNICA, SINO LA CREA       
          bdd.Maquina_unica(name).then(result =>{
            if(result) bdd.AgregarMaquina(name,id,ip,salon, piso,2,mac);
            else{ bdd.ActualizarMaquina(name, id, ip, mac); }       
          });

      }else{ 
        error(socket);
      }


    });   
}

//? ESCUCHA TODOS LOS CLIENTES QUE SE DESCONECTAN DEL SERVIDOR
function OnDisconnect(socket, io){ 
    let piso = Object.keys(global.array.clientes);
    
    //CICLO QUE RECORRE LAS LLAVE EN EL ARRAY DE CLIENTES (["1F","2F","1G"...])
    for (let i = 0 ; i < piso.length; i++){

        //CICLO QUE RECORRE LAS LLAVE DE CADA PISO EN EL ARRAY DE CLIENTES (["F-3","F-4","F-5"...])
        for (let j = 0; j< Object.keys(global.array.clientes[piso[i]]).length; j++){
          let salon = Object.keys(global.array.clientes[piso[i]]);

          //CICLO QUE RECORRE LAS MAQUINAS DE CADA SALON EN EL ARRAY DE CLIENTES
          for(let k = 0; k< global.array.clientes[piso[i]][salon[j]].length;k++){        
            let maquina = Object.keys(global.array.clientes[piso[i]][salon[j]]);
              if(global.array.clientes[piso[i]][salon[j]][maquina[k]]['ID'] == socket.id){

                global.array.clientes[piso[i]][salon[j]][maquina[k]]['ID'] = null;
                global.array.clientes[piso[i]][salon[j]][maquina[k]]['STATUS'] = STATUS.APAGADO;
                global.array.clientes[piso[i]][salon[j]][maquina[k]]['MAC'] = null;
                global.array.clientes[piso[i]][salon[j]][maquina[k]]['IP'] = null;

                mostrar(global.array.clientes[piso[i]][salon[j]], piso[i], salon[j]);

                //ACTUALIZA PAGINA DE GESTOR
                for(let l =0; l < global.array.gestores.length; l++){
                    if(global.array.gestores[l]["SALON"] == salon[j]){
                      let array = Actualizar_gestor(global.array.gestores[l]['ID_USUARIO'],piso[i], salon[j]);
                      io.to(global.array.gestores[l]['ID_USUARIO']).emit('GESTOR-SALON',array);
                    }      
                }

                //ACTUALIZA PAGINA DE MODULO
                for (let m = 0; m < global.array.modulos.length; m++) {
                  if(global.array.modulos[m]["PISO"] == piso[i])
                  { 
                    const array2 = Actualizar_modulo(piso[i], salon[j]);
                    io.to(global.array.modulos[m]['ID_USUARIO']).emit('MODULO-SALON',array2);
                  }
   				      }
                return;
              } 
          }
        }
      }
}

//? ESCUCHA ACCIONES DE LA PAGINA PARA QUE CLIENTES EN ESPECIFICO LA EJECUTEN
function OnAction(socket,io){
  socket.on('CLIENTE-ACCION', (piso,salon,maquina,opcion, mensaje,fn)=>{
    
    switch(opcion){
      
            case "habilitar": //HABILITAR MAQUINA 

                  for (let i = 0; i < global.array.clientes[piso][salon].length; i++) {
                    if(global.array.clientes[piso][salon][i]["MAQUINA"] == maquina){
                      let id = global.array.clientes[piso][salon][i]["ID"];
                      io.to(id).emit('CLIENTE-STATUS',
                        STATUS.DISPONIBLE, 
                        global.array.clientes[piso][salon][i]["ESTUDIANTE"],
                        global.array.clientes[piso][salon][i]["MAQUINA"],
                        0, 
                        0);
                    }
                  }

                break;

            case "mensaje": //ENVIAR MENSAJE A MAQUINA
                  
                  for (let i = 0; i < global.array.clientes[piso][salon].length; i++) {
                    if(global.array.clientes[piso][salon][i]["MAQUINA"] == maquina){
                      let id = global.array.clientes[piso][salon][i]["ID"];
                      io.to(id).emit('CLIENTE-MENSAJE',mensaje);
                      
                    }
                  }

                break;

            case "encender": //ENCENDER MAQUINA

                  for (let i = 0; i < global.array.modulos.length; i++) {
                    if(global.array.modulos[i]["PISO"] == piso){
                      let id = global.array.modulos[i]["ID"];
                        bdd.ObtenerMac(salon,maquina).then(r =>{
                          io.to(id).emit('MODULO-WOL',r, true);
                        });
                      
                    }
                  }
                  
                break;

            case "apagado": //APAGAR MAQUINA

                for (let i = 0; i < global.array.clientes[piso][salon].length; i++) {
                    if(global.array.clientes[piso][salon][i]["MAQUINA"] == maquina){
                      let id = global.array.clientes[piso][salon][i]["ID"];
                      io.to(id).emit('CLIENTE-REMOTO',"shutdown -s /f /t 2");
                    }
                  }
                break;

            case "reiniciar": //REINICIAR MAQUINA

                  for (let i = 0; i < global.array.clientes[piso][salon].length; i++) {
                    if(global.array.clientes[piso][salon][i]["MAQUINA"] == maquina){
                      let id = global.array.clientes[piso][salon][i]["ID"];
                      io.to(id).emit('CLIENTE-REMOTO',"shutdown -r /f /t 1");
                    }
                  }
                  
                break;

            case "extender": // EXTENDER PERIODO DE RESERVACION DE MAQUINA

                for (let i = 0; i < global.array.clientes[piso][salon].length; i++) 
                {
                  if(global.array.clientes[piso][salon][i]["MAQUINA"] == maquina)
                  {
                    for(let j = 0; j < global.array.gestores.length; j++)
                    {
                      if(global.array.gestores[j]["SALON"] == salon)
                      {
                        let id = global.array.clientes[piso][salon][i]["ID"];
                        io.to(id).emit('CLIENTE-STATUS',
                          STATUS.EXTENCION, 
                          global.array.clientes[piso][salon][i]["ESTUDIANTE"],
                          global.array.clientes[piso][salon][i]["MAQUINA"],
                          0,
                          global.array.gestores[j]["EXTENCION"]);
                      }
                    }
                  }
                }

                break;

            default:
                break;
        }

        fn({respuesta: true}); //*RETORNO DEL CALLBACK HACIA EL USUARIO DE LA PAGINA
        
      });
}

//? ESCUCHA ACCIONES DE LA PAGINA PARA QUE CLIENTES DE UN SALON LA EJECUTEN
function OnActionGlobal(socket,io){
  socket.on('CLIENTE-ACCION-GLOBAL', (piso,salon,opcion, mensaje,fn)=>{
    
    switch(opcion){

            case "mensaje": //ENVIA MENSAJE A MAQUINAS
                  
                  for (let i = 0; i < global.array.clientes[piso][salon].length; i++) {
                    if(global.array.clientes[piso][salon][i]["MAQUINA"] == maquina){
                      let id = global.array.clientes[piso][salon][i]["ID"];
                      io.to(id).emit('CLIENTE-MENSAJE',mensaje);
                      
                    }
                  }
                break;

            case "encender": //ENCIENDE SALON

                  console.clear();
                  for (let i = 0; i < global.array.modulos.length; i++) {
                    if(global.array.modulos[i]["PISO"] == piso){
                      let id = global.array.modulos[i]["ID"];
                        bdd.ObtenerMacPorSalon(salon).then(r =>{
                          
                          for(let k = 0; k < r.length; k++)
                          {
                            io.to(id).emit('MODULO-WOL',r, false);
                          }
                        });
                      
                    }
                  }
                  
                break;

            case "apagado": //APAGA SALON

                for (let i = 0; i < global.array.clientes[piso][salon].length; i++) {

                      let id = global.array.clientes[piso][salon][i]["ID"];
                      io.to(id).emit('CLIENTE-REMOTO',"shutdown -s /f /t 2");
                    
                  }
                break;

            case "reiniciar": //REINICIA SALON

                  for (let i = 0; i < global.array.clientes[piso][salon].length; i++) {

                      let id = global.array.clientes[piso][salon][i]["ID"];
                      io.to(id).emit('CLIENTE-REMOTO',"shutdown -r /f /t 1");
                    
                  }
                  
                break;
        }

        fn(true); //*RESPONDE DEVUELTA AL CALLBACK PASADO POR LA PAGINA
        
      });
} 

//? VERIFICA LA CEDULA DEL CLIENTE ENVIADA POR LA PAGINA EN MODO DE RESERVACION
function onVerificarCedula(socket, io){
  socket.on('CLIENTE-VERFICARCEDULA', (piso, salon, nombreMaquina, cedula, tIdentificacion, fn)=>{

    for (let i=0; i < global.array.clientes[piso][salon].length; i++)
      {
        if(global.array.clientes[piso][salon][i]["MAQUINA"] == nombreMaquina)
        {
          for(let j = 0; j < global.array.gestores.length; j++){
            if(global.array.gestores[j]["SALON"] == salon){

              fn(true, "MAQUINA HA SIDO RESERVADA CON EXITO"); //*CALLBACK EJECUTADO CUANDO PROCESO FUE EXITOSO
              io.to(global.array.clientes[piso][salon][i]["ID"]).emit('CLIENTE-STATUS',
                STATUS.ESPERA, 
                cedula,global.array.clientes[piso][salon][i]["MAQUINA"],
                global.array.gestores[j]['TIEMPO'], 
                global.array.gestores[j]['EXTENCION']
              );
          
              global.array.clientes[piso][salon][i]["ESTUDIANTE"] = cedula;

            }
          }
        }
      }
  });
}


//?CAMBIA EL ESTATUS DE LOS CLIENTES
function ClienteStatus(socket, io){
  socket.on('CLIENTE-STATUS', (status, piso, salon) =>{
    let arrayGestor;
    let arrayModulo;
    

    //ENCUENTRA INDEX DEL GESTOR
    for (let i = 0; i < global.array.gestores.length; i++) 
    {
      if(global.array.gestores[i]["SALON"] == salon)
      {
        arrayGestor = i;
      }
    }
    
    //ENCUENTRA INDEX DEL MODULO
    for (let i = 0; i < global.array.modulos.length; i++) 
    {
      if(global.array.modulos[i]["PISO"] == piso)
      { 
        arrayModulo = i;
      }
    }

    
    for(let i = 0 ; i < global.array.clientes[piso][salon].length; i++){

      if(global.array.clientes[piso][salon][i]["ID"] == socket.id && status != STATUS.DISPONIBLE)
      {
        //ACTUALIZA EL STATUS DEL CLIENTE (ADVERTENCIA, OCUPADO, EN ESPERA)
        global.array.clientes[piso][salon][i]["STATUS"]= status;
        break;    
      }
      else if(global.array.clientes[piso][salon][i]["ID"]==socket.id && status== STATUS.DISPONIBLE)
      { 
        //ACTUALIZA STATUS DEL CLIENTE (DISPONIBLE)
        global.array.clientes[piso][salon][i]["ESTUDIANTE"] = "Disponible";
        global.array.clientes[piso][salon][i]["STATUS"]= status;
        break;
      }
    }

    //ACTUALIZA A LA PAGINA DEL GESTOR 
    if(global.array.gestores[arrayGestor]["STATUS"] != GESTOR_STATUS.APAGADA)
    {
      const array = Actualizar_gestor(global.array.gestores[arrayGestor]['ID_USUARIO'],piso, salon);
      io.to(global.array.gestores[arrayGestor]['ID_USUARIO']).emit('GESTOR-SALON',array);
    }
    else //SI EL GESTOR NO ESTA DISPONIBLE PONE MAQUINAS EN CLIENTES
    {
      for(let i = 0 ; i < global.array.clientes[piso][salon].length; i++){
        if(global.array.clientes[piso][salon][i]['STATUS'] !== STATUS.APAGADO)
        {
          io.to(global.array.clientes[piso][salon][i]['ID']).emit('CLIENTE-STATUS', STATUS.CLASES, piso, salon);
        }
      }
    }

    //ACTUALIZA PAGINA DEL MODULO
    const array = Actualizar_modulo(piso, salon);
    if(global.array.modulos[arrayModulo])
      io.to(global.array.modulos[arrayModulo]['ID_USUARIO']).emit('MODULO-SALON',array);
  });
}


//? MOSTRAR ERROR POR CONSOLA
function error(socket){
  console.log(
    "==============================\n"+
    "MAQUINA CON ESE NOMBRE YA SE ENCUENTRA\n"+
    "==============================\n"
    );
    socket.disconnect(true);
}


//? MOSTRAR DATOS POR CONSOLA
function mostrar(array, piso, salon){

  console.log("=====================================");
  console.log("==========clientes totales===========");
  console.log(`============ ${piso} === ${salon}  ===========`);
  console.log("=====================================");
  console.log(array.filter(x => x.STATUS != STATUS.APAGADA));
  
}

module.exports = {
  OnConnect,
  OnDisconnect,
  OnAction,
  onVerificarCedula,
  ClienteStatus,
  OnActionGlobal,
};
