 const {escape, createConnection, createPool} = require('mysql');
 const util = require('util');
 const {MAPA, STATUS,GESTOR_STATUS, GESTORES} = require('./datosimportantes.js');
 global.array   = require('./datosImportantes.js');
 const pool = require('./connection-pool');
 pool.query = util.promisify(pool.query);


////////////////////////////////////////////////////////////////////////
//INSERTA USUARIO DEL A PAGINA WEB A LA BASE DE DATOS
async function Insert_usuario(data) {
  const sql = `INSERT INTO usuarios(nombre,password,idTipoUsuario) VALUES (${escape(data.username)},${escape(data.password)},${data.typeUser});`;
  const result = await pool.query(sql);
  if(result) return true;
  else return false;
}

////////////////////////////////////////////////////////////////////////
//VERIFICA EN BASE DEL NOMBRE DE LA MAQUINA SI EXISTE
async function Maquina_unica(nombre){
  const sql = `SELECT * from maquinas where nombre = ${ escape(nombre) }`;
  const result = await pool.query(sql);
  if(result.length < 1) return true;
  else return false; 
}

////////////////////////////////////////////////////////////////////////
//VERIFICA QUE TIPO DE ESTUDIANTE ES EN BASE A LA CEDULA
async function clasificarEstudiante(cedula){
  const sql = `SELECT descripcion
  FROM ( estudiantes
  INNER JOIN tipoestudiante
  ON estudiantes.tipoestudiante = tipoestudiante.idTipoEstudiantes) 
  where estudiantes.cedula = ${escape(cedula)};`;
  const result = await pool.query(sql);
  if(result[0]['descripcion']=='Privilegiado'){
    //QUERY PARA BUSCAR EL TIPO DE ESTUDIANTE
    return true;
  } else {
    return false;
  }
}
////////////////////////////////////////////////////////////////////////
//VERIFICA QUE TIPO DE USUARIO DEL FRONT-END EN BASE A SU NOMBRE
async function verificarUsario(user){
  const sql =`SELECT nombre, password, idTipoUsuario FROM usuarios WHERE nombre = ${escape(user)} ; `;
  const result = await pool.query(sql);
  if(result){
    return [true,result];
  } 
  else return [false];
}

////////////////////////////////////////////////////////////////////////
//AGREGA MAQUINA
function  AgregarMaquina(name,id,ip,salon, piso,tipo_maquina, mac){

  //PIDE ID DEL PISO A LA BASE DE DATOS
  let sql = `SELECT idPisos FROM pisos WHERE descripcion= ${ escape(piso) }`;
  
  pool.query(sql, (err, result) =>{
    if (err) throw err;
    let piscito = result[0]["idPisos"];
    
    //PIDE ID DEL SALON EN BASE DE LA DESCRIPCION Y IDPISO 
    sql = `SELECT idSalones FROM salones WHERE descripcion= ${ escape(salon) } AND  idPisos = ${piscito}`;    
    pool.query(sql,  (err, result) => {
      if (err) throw err; 
      let saloncito = result[0]["idSalones"];
      
            //INSERTA A LA BASE DE DATOS LA MAQUINA
            sql = `INSERT INTO maquinas (nombre, idSocket,ipv4, idSalones, idStatus, idTipoMaquina) VALUES ('${name}','${id}', '${ip}',${saloncito},1,${tipo_maquina})`;   
            pool.query(sql,  (err, result) => {
              if (err) throw err;
              sql = `SELECT idMaquinas FROM maquinas WHERE nombre = ${escape(name)}`
              pool.query(sql,  (err, result) => {
                sql = `INSERT INTO datosmaquinas (idMaquinas, MAC, Procesador, RAM, TarjetaGrafica) VALUES('${result[0]["idMaquinas"]}', '${mac}', 'WIP', 'WIP', 'WIP')`;
                pool.query(sql,  (err, result) => {
                  console.log(`${name} ha sido agregado con éxito`);
                  return;
                });
              });  

              
            });
          });
  });
}

function ActualizarMaquina(name, id, ip, mac){
  let socketcito = id;
  let sql = `UPDATE maquinas SET idSocket = "${socketcito}", ipv4 = ${escape(ip)} WHERE nombre = ${escape(name)}`;
  pool.query(sql,  (err, result) => {
    if (err) throw err;
    sql = `SELECT idMaquinas FROM maquinas WHERE nombre = ${escape(name)}`
    pool.query(sql,  (err, result) => {
      sql = `UPDATE datosmaquinas  SET MAC='${mac}', Procesador ='WIP', RAM= 'WIP', TarjetaGrafica='WIP' WHERE idMaquinas= '${result[0]["idMaquinas"]}'`;
      pool.query(sql,  (err, result) => {
        console.log(`${name} ha sido actualizado con exito en la bdd`);
        return;
      });
    });
    
  });



}
function CambiarStatus(array,status){
  let queries;
  array.forEach( item => {
    queries += mysql.format(`UPDATE maquinas SET idstatus = ${status} WHERE nombre = ${escape(items["MAQUINA"])}; `);
  });
  pool.query(queries);
}

//VERIFICA SI EXISTE LA MAQUINA EN BASE AL NOMBRE EN LA BASE DE DATOS
async function VerificarExistencia(nombre){
  const sql =`SELECT nombre FROM maquinas WHERE nombre = ${escape(nombre)} ; `;
  const result = await pool.query(sql);
  if(result.length > 0) return true;
  else return false;
}
async function IsValidoEstudiante(cedula, nacionalidad){

  /**
   * @TODO terminar esta funcion
   *  
   */
   const cedulita = nacionalidad + cedula;
   const sql =`SELECT TipoEstudiante, solvente,  FROM maquina WHERE cedula = ${escape(cedulita)}`;

   return true;
  /*
    SOME MAGIC HAPPENS HERE
    */
  }

//OBTENER NOMBRES DE MAQUIANAS DESDE LA BDD
async function GetMaquinas(salon){
  let sql = `SELECT idSalones FROM salones WHERE descripcion= ${ escape(salon) }`;
  let r = [];
  let saloncito = await pool.query(sql);
  sql = `SELECT nombre FROM maquinas WHERE idSalones = ${escape(saloncito[0]["idSalones"])}`; 
  let maquinitas = await pool.query(sql);
  for ( let i = 0; i  < maquinitas.length ; i++)
    r.push(maquinitas[i]["nombre"]);
  return r;

  }

  async function LlenarLista(){
    let sql = `SELECT idPisos, descripcion FROM pisos`;
    let PisosTodos = await pool.query(sql);
    let temp ={};
    for (let i= 0; i < PisosTodos.length; i++){
      global.array.clientes[PisosTodos[i].descripcion] = {};
    }
    sql = `SELECT idSalones, idPisos , descripcion FROM salones`;
    let SalonesTodos = await pool.query(sql);
    sql = `SELECT idSalones, idMaquinas , nombre, idTipoMaquina FROM maquinas`;
    let MaquinasTodas = await pool.query(sql);

    for (let piso = 0; piso < PisosTodos.length; piso++){
      temp = {};

      for (let salones = 0; salones < SalonesTodos.length; salones++){
        if (PisosTodos[piso].idPisos == SalonesTodos[salones].idPisos) {
          if(SalonesTodos[salones].descripcion != "PASILLO"){
            temp[SalonesTodos[salones].descripcion] = [];
            global.array.clientes[PisosTodos[piso].descripcion] = temp;


            
            for(let i=0; i< MAPA[PisosTodos[piso].descripcion][SalonesTodos[salones].descripcion].length; i++){

              for (let maquinas = 0; maquinas < MaquinasTodas.length; maquinas++) {


            //MANUEL EXPLICA QUE: VERIFICA SI EL ID DEL SALÓN EL IGGUAL A LA LLAVE FORANEA DE LA MAQUINA Y SOLO SI LA EL TIPO DE LA MAQUINA ES 2 
            if(MAPA[PisosTodos[piso].descripcion][SalonesTodos[salones].descripcion][i] == MaquinasTodas[maquinas].nombre)
            {   
              global.array.clientes[PisosTodos[piso].descripcion][SalonesTodos[salones].descripcion].push({"ID":null, "MAQUINA":MaquinasTodas[maquinas].nombre, "STATUS": STATUS.APAGADO, "ESTUDIANTE": null, "MAC": null, "IP":null});
              maquinas = MaquinasTodas.length;
            }
            if(MAPA[PisosTodos[piso].descripcion][SalonesTodos[salones].descripcion][i] == "vacio" )
            {
              global.array.clientes[PisosTodos[piso].descripcion][SalonesTodos[salones].descripcion].push("vacio");
              maquinas = MaquinasTodas.length;   
            }

            else if( i <= (  MAPA[PisosTodos[piso].descripcion][SalonesTodos[salones].descripcion].length - 1 ) ){
              global.array.clientes[PisosTodos[piso].descripcion][SalonesTodos[salones].descripcion].push({"ID":null, "MAQUINA":MAPA[PisosTodos[piso].descripcion][SalonesTodos[salones].descripcion][i], "STATUS": STATUS.APAGADO, "ESTUDIANTE": null, "MAC": null, "IP":null});
              maquinas = MaquinasTodas.length;  
            }
          }
        }
      }
    }
  }
}

for (let i = 0; i < MaquinasTodas.length ; i++) {
  for (let k = 0; k < GESTORES.length; k++){
    if(MaquinasTodas[i].nombre == GESTORES[k].nombre){
      global.array.gestores.push({
        "IP":null,
        "ID":null,
        "MAQUINA":GESTORES[k].nombre,
        "PISO":GESTORES[k].piso, 
        "SALON":GESTORES[k].salon,
        "STATUS":GESTOR_STATUS.APAGADA, 
        "MAC":null})
    }
  }
}

return PisosTodos;
}

////////////////FUNCIONES NUEVAS///////////////////////
async function ObtenerMacPorSalon(salon){
   let sql = `SELECT idSalones FROM salones WHERE descripcion= ${ escape(salon) }`;
   let result = [];
   const SalonParaEncender = await pool.query(sql);
   sql = `SELECT idMaquinas FROM maquinas WHERE idSalones = ${escape (SalonParaEncender[0]["idSalones"])}`;
   const MaquinasParaEncender = await pool.query(sql);

   sql = `SELECT idMaquinas, MAC FROM datosmaquinas`
   const mactotales = await pool.query(sql);
     for (let i = 0; i < mactotales.length; i++) {
       for (let j = 0; j < MaquinasParaEncender.length; j++) {
         if(mactotales[i]["idMaquinas"] == MaquinasParaEncender[j]["idMaquinas"]){
          result.push(mactotales[i]["MAC"]);
        }
      }
    }
  return result;
}


async function ObtenerMac(salon, nombre){
   let sql = `SELECT idSalones FROM salones WHERE descripcion= ${ escape(salon) }`;
   let result;
   const SalonParaEncender = await pool.query(sql);
   sql = `SELECT idMaquinas, nombre FROM maquinas WHERE idSalones = ${escape (SalonParaEncender[0]["idSalones"])}`;
   const MaquinasParaEncender = await pool.query(sql);
   sql = `SELECT idMaquinas, MAC FROM datosmaquinas`
   const mactotales = await pool.query(sql);
     for (let i = 0; i < mactotales.length; i++) {
       for (let j = 0; j < MaquinasParaEncender.length; j++) {
         if(mactotales[i]["idMaquinas"] == MaquinasParaEncender[j]["idMaquinas"]){
            if(MaquinasParaEncender[j]["nombre"] == nombre)
            {
              result = mactotales[i]["MAC"];
            }          
        }
      }
    }
  return result;
}

module.exports = {
  Maquina_unica,
  ObtenerMacPorSalon,
  AgregarMaquina,
  ActualizarMaquina,
  CambiarStatus,
  clasificarEstudiante,
  IsValidoEstudiante,
  verificarUsario,
  Insert_usuario,
  VerificarExistencia,
  GetMaquinas,
  LlenarLista,
  ObtenerMac,
}