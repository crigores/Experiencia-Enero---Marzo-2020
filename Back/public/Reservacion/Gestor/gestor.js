const socket = io();
//const status = ["DISPONIBLE", "OCUPADO", "EN ESPERA", "ADVERTENCIA-1","ADVERTENCIA-2"];
const status = [0,1,2,3,4];
let TiempoExtend;



socket.on('GESTOR_SHOW', names=>{
  document.getElementById('maquina').innerHTML = gridSystem(names);
});

function algo(maquina) {
    let confirmar = confirm(`¿ESTÁ SEGURO QUE DESEA DESHABILITAR EL EQUIPO ${maquina}?`);
    if(confirmar){
      socket.emit('GESTOR', maquina,status[0]);
    }
    console.log("Decídete chamx");
  }


function ordenarComputadoras(a,b){
  const pc1 = a.NOMBRE.toUpperCase();
  const pc2 = b.NOMBRE.toUpperCase();
  let comparison = 0;
  if(pc1 > pc2) comparison = 1;
  else if(pc1 < pc2) comparison = -1;
  return comparison;
}


function gridSystem(names){
  console.log("holaaaa");
  console.log(names);
  names.sort(ordenarComputadoras);
  let acumulador = '';
  acumulador= '<div class="row ">';
  for(let i = 1;i<names.length+1;i++){
    if(names[i-1]["STATUS"] == status[0]){
        let indexGuion = names[i-1]['NOMBRE'].indexOf("-") + 1;
        let nombrePro = names[i-1]['NOMBRE'].substring(indexGuion, names[i-1]['NOMBRE'].length);
        acumulador+='<div class="col-md-1 espacio"><button class="btn btn-success" name="'+names[i-1]['NOMBRE']+'" onmouseover="verCedula('+i+')" onmouseout="ocultarCedula('+i+')" onclick="algo(\''+names[i-1]['NOMBRE'] +'\')"><img class="img-pc" src="/img/computadora-vector-png-2.png"><br>'+nombrePro+'</button><div class="btn-group row zero-margin"><button style="padding-left: 18px" class=" col-md-6 btn btn-success">+</button><button class="col-md-6 btn btn-success">S</button></div>';
        acumulador+= '<div class="hover-pc" id="'+i+'">'+names[i-1]["CEDULA"]+'</div></div>';
    }else  if(names[i-1]["STATUS"] == status[2]){
      let indexGuion = names[i-1]['NOMBRE'].indexOf("-") + 1;
      let nombrePro = names[i-1]['NOMBRE'].substring(indexGuion, names[i-1]['NOMBRE'].length);
        acumulador+='<div class="col-md-1 espacio"><button class="btn btn-espera" name="'+names[i-1]['NOMBRE']+'"  onmouseover="verCedula('+i+')" onmouseout="ocultarCedula('+i+')" onclick="algo(\''+names[i-1]['NOMBRE'] +'\')"> <img class="img-pc" src="/img/computadora-vector-png-2.png"><br>'+nombrePro+'</button><div class="btn-group row zero-margin"><button style="padding-left: 18px" class="col-md-6 btn btn-espera">+</button><button class="col-md-6 btn btn-espera">S/button></div>';
        acumulador+= '<div class="hover-pc" id="'+i+'">'+names[i-1]["CEDULA"]+'</div></div>';
      }else if(names[i-1]["STATUS"] == status[1]){
        let indexGuion = names[i-1]['NOMBRE'].indexOf("-") + 1;
        let nombrePro = names[i-1]['NOMBRE'].substring(indexGuion, names[i-1]['NOMBRE'].length);
        acumulador+='<div class="col-md-1 espacio"><button class="btn btn-danger" name="'+names[i-1]['NOMBRE']+'"  onmouseover="verCedula('+i+')" onmouseout="ocultarCedula('+i+')" onclick="algo(\''+names[i-1]['NOMBRE'] +'\')"> <img class="img-pc" src="/img/computadora-vector-png-2.png"><br>'+nombrePro+'</button><div class="btn-group  row zero-margin"><button style="padding-left: 18px" class="col-md-6 btn btn-danger">+</button><button class="col-md-6 btn btn-danger">S/button></div>';
        acumulador+= '<div class="hover-pc" id="'+i+'">'+names[i-1]["CEDULA"]+'</div></div>';
      }else if(names[i-1]["STATUS"] == status[3]){
        let indexGuion = names[i-1]['NOMBRE'].indexOf("-") + 1;
        let nombrePro = names[i-1]['NOMBRE'].substring(indexGuion, names[i-1]['NOMBRE'].length);
        acumulador+='<div class="col-md-1 espacio"><button class="btn btn-advertencia1" name="'+names[i-1]['NOMBRE']+'"  onmouseover="verCedula('+i+')" onmouseout="ocultarCedula('+i+')" onclick="algo(\''+names[i-1]['NOMBRE'] +'\')"> <img class="img-pc" src="/img/computadora-vector-png-2.png"><br>'+nombrePro+'</button><div class="btn-group  row zero-margin"><button style="padding-left: 18px" class="col-md-6 btn btn-advertencia1">+</button><button class="col-md-6 btn btn-advertencia1">S/button></div>';
        acumulador+= '<div class="hover-pc" id="'+i+'">'+names[i-1]["CEDULA"]+'</div></div>';
      }else if(names[i-1]["STATUS"] == status[4]){
        let indexGuion = names[i-1]['NOMBRE'].indexOf("-") + 1;
        let nombrePro = names[i-1]['NOMBRE'].substring(indexGuion, names[i-1]['NOMBRE'].length);
        acumulador+='<div class="col-md-1 espacio"><button class="btn btn-advertencia2" name="'+names[i-1]['NOMBRE']+'"  onmouseover="verCedula('+i+')" onmouseout="ocultarCedula('+i+')" onclick="algo(\''+names[i-1]['NOMBRE'] +'\')"> <img class="img-pc" src="/img/computadora-vector-png-2.png"><br>'+nombrePro+'</button><div class="btn-group  row zero-margin"><button style="padding-left: 18px" class="btn btn-advertencia2">+</button><button class="btn btn-advertencia2">S/button></div>';
        acumulador+= '<div class="hover-pc" id="'+i+'">'+names[i-1]["CEDULA"]+'</div></div>';
      }
    if((i%11)==0){
      acumulador+="</div>";
    }
    if((i%11)==0 && i<names.length){
      acumulador+= '<div class="row fila-pro">';
    }
  }
  if((names.length%12)!=0){
    acumulador+="</div>";
  }
  return acumulador;
}

function extenderTiempo(name, salon, piso){
  socket.emit('EXTENDS',name, piso, salon, TiempoExtend);
}
function enviarMensaje(name, salon, piso){
  const mensaje = prompt("ESCRIBA EL MENSAJE");
  socket.emit("GESTOR-MENSAJE",name, salon, piso, mensaje);
}



function verCedula(id){
  cedula = document.getElementById(id);
  cedula.style.opacity= 1;
  cedula.style.visibility = 'visible';
}
function ocultarCedula(id){
  cedula = document.getElementById(id);
  cedula.style.opacity= 0;
  cedula.style.visibility = 'hidden';
}

