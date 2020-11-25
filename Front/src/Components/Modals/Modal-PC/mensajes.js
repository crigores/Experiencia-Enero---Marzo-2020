import React, {Component} from "react";
//COMUNICACION Y SEGURIDAD
import Auth from "../../auth";
import Socket from "../../../socket";

//CSS
import styles from './mensajes.module.css';

//variables



export default class Modal extends Component {
    
    constructor(props){
        super(props);
        this.auth = new Auth(); 
        this.state ={ 
			tipo_input: 1,
			texto: '',
		};
		this.radio_pers = this.radio_pers.bind(this);
		this.radio_pred = this.radio_pred.bind(this);
		this.enviar = this.enviar.bind(this);	

	}

	radio_pers() {
		document.getElementById('input_pred').style.display ='none';
		document.getElementById('input_pers').style.display ='inline-block';
		this.setState({tipo_input: 1});
	}
	
	radio_pred() {
		document.getElementById('input_pred').style.display ='inline-block';
		document.getElementById('input_pers').style.display ='none';
		this.setState({tipo_input: 2});
	}
	
	enviar(){
		let seleccion = document.getElementById('input_pred');
		console.clear();
		console.log(seleccion);
		if (this.tipo_input == 1) {
			let valor = document.getElementById('input_pers').value;
			this.setState({texto: valor});
		}else {
			let valor = seleccion.options[seleccion.selectedIndex].text;
			this.setState({texto: valor});
		}
	
		if (!this.texto) {
			alert("esta vacio");
		} else {
			console.log(this.texto)
		}
		
		document.getElementById('input_pers').value = '';
	}

	render(){
		return(
			<div className={styles.msj}>
				<input id="input_pers" type="text"/>
				<select id="input_pred" name="pais">
					<option value="1"></option>
					<option value="2">El laboratorio cerrara en 5 minutos</option>
					<option value="3">Esta Prohibido Comer en Los Laboratorios</option>
					<option value="4">Por favor guardar los Archivos</option>
				</select>
				<br/>
				<br/>
				<input id="pers" type="radio" name="control" value="1" checked onChange={() =>this.radio_pers()}/>
				<label htmlFor="pers">Personalizado</label>
				<br/>
				<input id="pred" type="radio" name="control" value="2" onChange={() =>this.radio_pred()}/>
				<label htmlFor="pred">Predefinido</label>
		
				<input type="button" value="enviar" onClick={()=> this.enviar()}/>
			</div>
		);
	}
}