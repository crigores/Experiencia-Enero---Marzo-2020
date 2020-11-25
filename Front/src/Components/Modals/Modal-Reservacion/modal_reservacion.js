import React, {Component} from 'react';
import styles from './modal_reservacion.module.css';
//SEGURIDAD Y COMUNICACION
import Socket from "../../../socket";
import { GESTOR_STATUS } from "../../../variables-entorno";
import cerrar from '../../Grid/img/close_icon.svg';

export default class Modal_Reservacion extends Component{
	constructor(props) {
		super(props);
		this.state = {
			status: 0, 
			piso: props.piso,
		}

		this.habilitar = this.habilitar.bind(this);
		this.deshabilitar = this.deshabilitar.bind(this);
		this.encender = this.encender.bind(this);
		this.cerrar = this.cerrar.bind(this);
	}

	componentDidMount(){
		this.setState({status: 0});
	}

	componentWillUpdate(nextProps, nextState){
	
		if(this.props.status !== nextProps.status || this.props.piso !== nextProps.piso  )
		{
			console.log(nextProps.piso)
			this.setState({
				status: nextProps.status,
				piso: nextProps.piso
			})
		}

	}

	componentDidUpdate(prevProps) {
		if(this.props.status !== prevProps.status || this.props.piso !== prevProps.piso )
		{
			
			this.setState({
				status: this.props.status,
				piso: prevProps.piso
			})
		}
	}
      
	cerrar(e){
		/**
		 * SE ENCARGA DE CERRAR EL MODAL QUE ADMINISTRA LAS
		 * OPCIONES DISPONIBLES QUE MANEJA UN SALON
		 */
		e.preventDefault();
		document.getElementById("modal").style.display = "none";
		document.getElementById("nombreSalon").innerHTML = '';
	}

	habilitar(e){
		/**
		 * SE ENCARGA DE ESTABLECER EL ESTADO DE UN SALON DE CLASES A RESERVACION
		 */
		e.preventDefault();
		console.log(this.state.piso);
		let piso 	  = this.state.piso;
		let tiempo    = document.getElementById('time').value;
		let salon 	  = document.getElementById("nombreSalon").innerHTML;
		let confirmacion = window.confirm("¿Esta seguro que quiere habilitar a modo de reservacion el salon?");
		if(confirmacion)
		{
			Socket.emit('COORDINACION-CAMBIOSTATUS',piso,salon,tiempo,GESTOR_STATUS.RESERVACION, (bool)=>{
					if(bool) alert("Salon en modo de reservacion");
			});
		}
		document.getElementById("modal").style.display = "none";

	}
	
	 
	deshabilitar(){
		/**
		 * SE ENCARGA DE ESTABLECER EL ESTADO DE UN SALON DE RESERVACION A CLASES
		 */
		let piso 	  = this.state.piso;
		let salon 	  = document.getElementById("nombreSalon").innerHTML;
		let confirmacion = window.confirm("¿Esta seguro que quiere deshabilitar del modo de reservacion el salon?");
		if(confirmacion)
		{
			Socket.emit('COORDINACION-CAMBIOSTATUS',piso,salon,0,GESTOR_STATUS.CLASES, (bool)=>
			{
		  		if(bool) alert("Salon en modo de clases");
		  		else alert("HA OCURRIDO UN ERROR");
			});
		}	
		document.getElementById("modal").style.display = "none";
	}
	
	encender(){
		let piso 	  = this.state.piso;
		let salon 	  = document.getElementById("nombreSalon").innerHTML;

		let confirmacion = window.confirm("¿Esta seguro que quiere encender el gestor?");
		if(confirmacion)
		{
			Socket.emit('COORDINACION-ACCION',piso,salon);
		}	
		document.getElementById("modal").style.display = "none";

	}

	render(){

		if(this.state.status === GESTOR_STATUS.APAGADA)
		{
			return(
				<div className={styles.contenedor} id="modal">
					<div className={styles.modal}>
						<h1>Reservar <span id="nombreSalon"></span></h1>
						<img src={cerrar} alt=""onClick={this.cerrar}/><br/>

						<br/>
						<label className={styles.statusReser} id="statusReser"></label>
						<button onClick={this.encender}>
							Encender
						</button>
					</div>
				</div>
			);
		}
		else if(this.state.status === GESTOR_STATUS.CLASES)
		{
			return(
				<div className={styles.contenedor} id="modal">
					<div className={styles.modal}>
						<h1>Reservar <span id="nombreSalon"></span></h1>
						<img src={cerrar} alt=""onClick={this.cerrar}/><br/>
						<label htmlFor="">Cantidad de Tiempo para Reservar </label>
						<select id="time">
							<option value="45">45 min</option>
							<option value="60">60 min</option>
							<option value="90">90 min</option>
							<option value="120">120 min</option>
							<option value="Ilimitado">Ilimitado</option>
						</select>
						<br/><br/>

						<button onClick={this.habilitar}>
							Habilitar
						</button>
					</div>
				</div>
			);
		}
		else if(this.state.status === GESTOR_STATUS.RESERVACION)
		{
			return(
				<div className={styles.contenedor} id="modal">
					<div className={styles.modal}>
						<h1>Reservar <span id="nombreSalon"></span></h1>
						<img src={cerrar} alt=""onClick={this.cerrar}/><br/>

						<br/>
						<label className={styles.statusReser} id="statusReser"></label>
						<button onClick={this.deshabilitar}>
							Desabilitar
						</button>
					</div>
				</div>
			);
		}
	}
}
		