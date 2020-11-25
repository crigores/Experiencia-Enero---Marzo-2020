

function radio_pers() {
	document.getElementById('input_pred').style.display ='none';
	document.getElementById('input_pers').style.display ='inline-block';
	tipo_input = 1;
}

function radio_pred() {
	document.getElementById('input_pred').style.display ='inline-block';
	document.getElementById('input_pers').style.display ='none';
	tipo_input = 2;
}

function enviar(){

	if (tipo_input == 1) {
		texto = document.getElementById('input_pers').value;
	}else {
		texto = seleccion.options[seleccion.selectedIndex].text;
	}

	if (!texto) {
		alert("esta vacio");
	} else {
		console.log(texto)
	}
	
	document.getElementById('input_pers').value = '';
}