//const status = ["DISPONIBLE", "OCUPADO", "EN ESPERA", "ADVERTENCIA-1","ADVERTENCIA-2"];
const ESTATUTO = [0,1,2,3,4];
const bdd = require('./Reservaciones-bdd.js');
const {GESTOR_STATUS, STATUS, MAPA_PISO, MODULO_STATUS} = require('./datosImportantes.js');
global.array   = require('./datosImportantes.js');

function CedulaUnica(cedula, array){
        bool = true;
        array.forEach(cliente => {
          if(cedula == cliente["ESTUDIANTE"]) bool = false;
        });
        return bool; 
}
function disponibilidad(id,status,array){
    let disponibles = 0;
    for (let i=0;i<array.length;i++){
      if(id == array[i]["ID"]){
        array[i]["STATUS"] = status;
      }
      if(array[i]["STATUS"] == ESTATUTO[0]){
            disponibles = disponibles +1;          
      }
    }
    return disponibles
  }
   
  function disponible(array){
    let disponible=0;
    for (let i=0;i<array.length;i++){
      if(array[i]["STATUS"] == ESTATUTO[0]){
          disponible = disponible +1;
      }
    }
    return disponible;
  }
  
  function namesArray(array){
    let maquinas_to_modulo = [];
    for(let j = 0;j< array.length; j++){
      if(array[j]["STATUS"] == ESTATUTO[0]){
        maquinas_to_modulo.push({"NOMBRE":array[j]["MAQUINA"], "STATUS":array[j]["STATUS"], "CEDULA": "Disponible"});
      }else
        maquinas_to_modulo.push({"NOMBRE":array[j]["MAQUINA"], "STATUS":array[j]["STATUS"], "CEDULA": array[j]["ESTUDIANTE"]});
    }
    return maquinas_to_modulo;
  }
  
  
  ////////////////////////////////////////////////////////////////////////
  //VERIFICIA SI ES LA UNICA MAQUINA CON ESE NOMBRE CONECTADA EN LA LISTA DINAMICA
    function Maquina_Unica(nombre,array){
    bool = true;
      array.forEach(cliente => {
      if (cliente != "vacio")
        if ( (nombre == cliente["MAQUINA"])  && cliente["ID"] != null) bool = false;
    });
    return bool;
  }
  function Maquina_Disponible(maquina,array){
    bool = false;
    for (let i=0;i<array.length;i++)
    { 
        if(maquina == array[i]["MAQUINA"])
        {
          bool = true;
        }
    }
    return bool;
  }
  function ExisteIP(ip,array){
    bool = false;
    for (let i=0;i<array.length;i++){ 
        if(ip == array[i]["IP"]){
          bool = true;
        }
    }
    return bool;
  }
  function HabilitarSalon(array, socket, status){
    for(let i=0;i<array.length;i++){
      array[i]["STATUS"] = 0;
      socket.to(array[i]["ID"]).emit("ACTIVACION",bool);
    }
    bdd.CambiarStatus(array,status);
  }

  

  function ordenarComputadoras(a,b){
      const pc1 = a.NOMBRE.toUpperCase();
      const pc2 = b.NOMBRE.toUpperCase();
      let comparison = 0;
      if(pc1 > pc2) comparison = 1;
      else if(pc1 < pc2) comparison = -1;
      return comparison;
}

//////////////////////////////////////////
/////////////////////////////////////////
//      FUNCIONES DE VERSION 2         //
//////////////////////////////////////////
/////////////////////////////////////////

function Actualizar_gestor(id,piso, salon){

  
  for(let i =0; i < global.array.gestores.length; i++){
      if(id == global.array.gestores[i]['ID_USUARIO'])
      {
        let tiempito;
        if(global.array.gestores[i]['TIEMPO'] < 0) tiempito = "ILIMITADO";
        else tiempito = global.array.gestores[i]['TIEMPO'];
        let array = {
          grid: global.array.GRID[salon],
          maquina: [],
          modo: global.array.gestores[i]['STATUS'],
          tiempo: tiempito,
          extencion: global.array.gestores[i]['EXTENCION']
        };
        for (let i = 0; i < global.array.clientes[piso][salon].length; i++) {
          array["maquina"].push(global.array.clientes[piso][salon][i]);
        }
        return array;
      }
    }
    return null;
}

function Actualizar_modulo(piso, salon){
  for(let i =0; i < global.array.gestores.length; i++){
      if(salon == global.array.gestores[i]['SALON'])
      {
        let tiempito;
        if(global.array.gestores[i]['TIEMPO'] < 0) tiempito = "ILIMITADO";
        else tiempito = global.array.gestores[i]['TIEMPO'];
        let array = {
          grid: global.array.GRID[salon],
          maquina: [],
          modo: global.array.gestores[i]['STATUS'],
          tiempo: tiempito
        };
        for (let i = 0; i < global.array.clientes[piso][salon].length; i++) {
          array["maquina"].push(global.array.clientes[piso][salon][i]);
        }
        return array;
      }
    }
    return null;
}

function Actualizar_coordinacion(piso){

  let array = [];
      for(let i=0; i < MAPA_PISO[piso].length; i++)
      {
        for(let j =0; j < global.array.gestores.length; j++)
        {
          if(global.array.gestores[j]["SALON"] == MAPA_PISO[piso][i].nombre)
          {
            array.push({
              nombre: MAPA_PISO[piso][i].nombre,
              status: global.array.gestores[j]["STATUS"],
            });
            j = global.array.gestores.length;
          }
          else if(MAPA_PISO[piso][i].nombre == "M")
          {
            let estadoModulo = MODULO_STATUS.APAGADA;
            for(let k = 0; k < global.array.modulos.length; k++)
            {
              if(global.array.modulos[k]["PISO"] == piso)
              {
                if(global.array.modulos[k]["STATUS"] == MODULO_STATUS.ENCENDIDO)
                  estadoModulo = MODULO_STATUS.ENCENDIDO;
                  
                k = global.array.modulos.length;      
              }

            }
            array.push({
              nombre: MAPA_PISO[piso][i].nombre,
              status: estadoModulo,
            });
            j = global.array.gestores.length;
          }
          else if(MAPA_PISO[piso][i].nombre == "vacio"){
            array.push({
              nombre: " ",
              status:99
            });
            j = global.array.gestores.length;
          }         
        }
      }

      return array;
}

function FindGestorBySalon(salon){
  let truegestor = salon.replace('-', '');
  truegestor = truegestor.concat('-1');
  return truegestor;
}




//////////////////////////////////////////
/////////////////////////////////////////
//      FUNCIONES DE VERSION 2         //
//////////////////////////////////////////
/////////////////////////////////////////

module.exports = {
    CedulaUnica,
    disponibilidad,
    disponible,
    namesArray,
    Maquina_Unica,
    Maquina_Disponible,
    ExisteIP,
    HabilitarSalon,
    ordenarComputadoras,
    Actualizar_gestor,
    Actualizar_modulo,
    Actualizar_coordinacion,
    FindGestorBySalon,
}