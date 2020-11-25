
const socket = io();
function algo(aux) {
    let confirmar = confirm(`¿ESTÁ SEGURO QUE DESEA HABILITAR EL SALON?`);
    if(confirmar){
      let combo = document.getElementById("modo");
      const modo = combo.options[combo.selectedIndex].value;
      combo = document.getElementById("sin");
      const sinP = combo.options[combo.selectedIndex].value;
      combo = document.getElementById("con");
      const conP = combo.options[combo.selectedIndex].value;
      socket.emit('COORDINACION', aux,modo,sinP,conP);
    }
    console.log("Decídete chamx");
  }

 