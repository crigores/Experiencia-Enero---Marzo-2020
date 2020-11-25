const socket = io();
function algo () {
    if(document.getElementById("cedula").value == ""){
      alert("Debe ingresar una cédula");
    } else if(document.getElementById("cedula").value.length <7){
      alert("La cédula debe tener mínimo 7 dígitos");
    } else if(document.getElementById("numero-maquinas").value == "0"){
      alert("No hay máquinas disponibles");
    }else{
      /**
       * @todo enviar piso y salon desde modulo
       
       */
      let piso;
      let salon;
      let tiempoAsignado = "";
      let opcionPrivilegio = `<option value='1'>1 hora</option><option value='1.5'>1 hora y media</option><option value='2'>2 horas</option>`;
      let opcionNormal = '<option>1 hora</option>';
      let cedula = document.getElementById("cedula");
      socket.emit('CEDULA-CONFIRMADA', cedula);
      socket.on("CEDULA-CONFIRMADA", Estudiante =>{
        if(Estudiante){
          determinarTiempo(opcionPrivilegio);
        }else{
          determinarTiempo(opcionNormal);
        }
      });      
      document.getElementById("cedula").value = "";
    }
    
}

//Función que determina el tiempo que puede tener el estudiante según su modalidad de estudios.
function determinarTiempo(opcion){
  document.getElementById('tiempo').innerHTML = opcion; //Llena a la lista con las posibles opciones.
  let selector = document.getElementById('tiempo');
  tiempoAsignado = selector.options[selector.selectedIndex].value;
  document.getElementById('reservar').innerHTML = `<button onclick='reservar(${cedula}, ${tiempoAsignado})'>RESERVAR</button>`;
}

//Función que permite reservar la máquina luego de haber determinado el tiempo que le corresponde al estudiante.
function reservar(cedula, tiempo){ 
  let piso = "";
  let salon = "";
  if(tiempoAsignado == "1" || tiempoAsignado == "1.5" || tiempoAsignado == "2"){
    document.getElementById('reservar').innerHTML = "";
    socket.emit('MODULO-ASIGNACION', cedula, piso, salon, tiempo);  
  }else{
    alert("CANTIDAD DE TIEMPO NO PERMITIDA");
  }
}

socket.on('MAQUINAS_DISPONIBLE', (Maquinas_Disponibles) =>{
  document.getElementById("numero-maquinas").innerHTML = Maquinas_Disponibles;
});
socket.on('CEDULA-ERROR', (error) =>{
  alert(error);
});

socket.on('NAMEPC', (name) =>{
  document.getElementById("nombre-maquina").innerHTML = name;
});

const form = document.getElementById('login');

function algo2(event){
  if(event.keyCode === 13){
    event.preventDefault();
    document.getElementById("boton-cedula").click();
  }
}