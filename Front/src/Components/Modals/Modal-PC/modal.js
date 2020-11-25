import React, {Component} from "react";
//COMUNICACION Y SEGURIDAD
import Auth from "../../auth";
import Socket from "../../../socket";
import { TIPO_USUARIO, GESTOR_STATUS, CLIENTE_STATUS } from "../../../variables-entorno";

//CSS
import styles from './modal.module.css';
//IMG
import on_ICO from './img/on-icon.svg';
import off_ICO from './img/off-icon.svg';
import restart_ICO from './img/restart-icon.svg';
import message_ICO from './img/message-icon.svg';
import enable_ICO from './img/enable-icon.svg';
import bonus_ICO from './img/bonus-icon.svg';
import time_ICO from './img/time_icon.svg';
import user_ICO from './img/user_icon.svg';

//import sweetalert2 from './sweetalert2.min.js';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default class Modal extends Component{
    
    
    constructor(props){
        super(props);
        this.auth = new Auth(); 
        this.state ={ 
            maquina: props.nombre,
            piso: this.auth.getTokenValue().piso,
            status: props.status,
            salon: props.salon,
			id: props.id,
			modo: props.modo,
			identificacion: props.cedula,
			tIdentificacion: this.tIdentificacion,
			tiempo: props.tiempo,
			callback: true,
        };
		this.Opcion = this.Opcion.bind(this);     
		this.onSubmit = this.onSubmit.bind(this);
   }
   



   componentWillUpdate(nextProps, nextState){
	if( nextProps.salon !== this.props.salon || nextProps.maquina !== this.props.maquina || nextProps.modo !== this.props.modo || nextProps.status !== this.props.status)
    {

        this.setState({
            maquina: nextProps.nombre,
            salon: nextProps.salon,
			id: nextProps.id,
			modo: nextProps.modo,
			status: nextProps.status,
			identificacion: nextProps.cedula,
			tiempo: nextProps.tiempo,
		});
		
    }
}
  

   Opcion(opcion){
	   const {piso, salon, id} = this.state;
		//let texto;
		let r;
	   if(this.state.callback)
	   {
		this.setState({callback:false},()=>{

			switch(opcion){
 
				case "habilitar":
					Socket.emit('CLIENTE-ACCION', piso, salon, id, opcion, null, (bool) =>{ if(bool.respuesta) this.setState({callback:true})});
					break;

				case "mensaje":
					(async () => {
						const { value: msj } = await Swal.fire({
						  title: 'Ingrese el Mensaje',
						  input: 'text',
						  inputOptions: {
							apples: 'Apples',
							bananas: 'Bananas',
							grapes: 'Grapes',
							oranges: 'Oranges'
						  },
						  inputPlaceholder: 'Mensaje',
						  inputAttributes: {
							maxlength: 10,
							autocapitalize: 'off',
							autocorrect: 'off'
						  }
						})

						if (msj !== undefined) {
							if (msj.trim() === "") {
								Swal.fire('esta vacio');
							}else {
								Socket.emit('CLIENTE-ACCION', piso, salon, id, opcion, msj, (bool) =>{ if(bool.respuestaol) this.setState({callback:true})});
							}
						}
						})();
					break;

				case "encender":
					Socket.emit('CLIENTE-ACCION', piso, salon, id, opcion, null, (bool) =>{ if(bool.respuesta) this.setState({callback:true})});
					break;

				case "apagado":
					r = prompt("si quieres apagar este equipo escribe la palabra: \"apagado\" ");
					if (r.localeCompare("apagado") === 0) {
						//texto = "El equipo se apagará";
						Socket.emit('CLIENTE-ACCION', piso, salon, id, opcion, null, (bool) =>{ if(bool.respuesta) this.setState({callback:true})});
					
					} else if (r === null || r === "") {
						//texto = "Reinicio cancelado";
					}
					break;
				case "reiniciar":
					r = prompt("si quieres apagar este equipo escribe la palabra: \"reiniciar\"");
					if (r.localeCompare("reiniciar") === 0 ) {
					Socket.emit('CLIENTE-ACCION', piso, salon, id, opcion, null, (bool) =>{ if(bool.respuesta) this.setState({callback:true})});
					break;
					} else if (r === null || r === "") {
						//texto = "Reinicio cancelado";
					}
					break;

				case "extender":
					Socket.emit('CLIENTE-ACCION', piso, salon, id, opcion, null, (bool) =>{ if(bool.respuesta) this.setState({callback:true})});
					break;
									
				default:
					break;
			}
			this.setState({callback:true});			
		});
	   }
	}

	onSubmit(e) {
		e.preventDefault();

		let cedula = this.cedula.value;
		let tIdentificacion = this.tIdentificacion.value;

		if(/^\s*$/.test(cedula)){

		}else{
			if(this.state.callback)
			{
			this.setState({callback:false},()=>{
				
				Socket.emit('CLIENTE-VERFICARCEDULA', this.state.piso, this.state.salon, this.state.id ,cedula, tIdentificacion, (bool, msj)=>{
			
						this.setState({callback:true});
						console.log(bool +"  "+msj);
						alert(msj);			
				});
			});

		}

		}
	}

	render(){
		//! MODALES DEL GESTOR
		if ( this.auth.getConfirm().role === TIPO_USUARIO.GESTOR || this.auth.getConfirm().role === TIPO_USUARIO.COORDINACION )
		{ 
			//?MODALES PARA GESTOR SI ESTAN EN MODO DE RESERVACION
			if(this.state.modo === GESTOR_STATUS.RESERVACION)
			{
				//DIPONIBLE
				if(this.state.status === CLIENTE_STATUS.DISPONIBLE)
				{
					return(
						<div className={styles.iconos}>
							
							<span id="off" onClick={() => this.Opcion("apagado")}><img src={off_ICO}  alt=""/> Apagado</span>
							<br/>
							<span id="restart" onClick={() => this.Opcion("reiniciar")}><img src={restart_ICO}  alt=""/> Reiniciar</span>
							<br/>
							<span id="bonus" onClick={() => this.Opcion("extender")}><img src={bonus_ICO}  alt=""/> Extender</span>
							<br/>
						</div>

					);
					
				}
				else if(this.state.status === CLIENTE_STATUS.ADVERTENCIA_1 || this.state.status === CLIENTE_STATUS.ADVERTENCIA_1 || this.state.status === CLIENTE_STATUS.OCUPADO )
				{  // OCUPADO  ADVERTENCIA-1      ADVERTENCIA-2
				   // ADV-0 ADV-1 ADV-2 
					return(
						<div className={styles.iconos}>
							<span id="ci" ><img src={user_ICO}  alt=""/> C.I: {this.state.identificacion}</span>
							<br/>
							<span id="on"><img src={time_ICO}  alt=""/> Tiempo: {this.state.tiempo} </span>
							<br/>
							<br/>
							<span id="enable" onClick={() => this.Opcion("habilitar")}><img src={enable_ICO}  alt=""/> Habilitar</span>
							<br/>
							<span id="message" onClick={() =>this.Opcion("mensaje")}><img src={message_ICO}  alt=""/> Mensaje</span>
							<br/>
						</div>
					);
	
				}
				else if( this.state.status === CLIENTE_STATUS.ESPERA )
				{
					return(
						<div className={styles.iconos}>
							<span id="ci" ><img src={user_ICO}  alt=""/> C.I: {this.state.identificacion}</span>
							<br/>
							<span id="on"><img src={time_ICO}  alt=""/> Tiempo: {this.state.tiempo} </span>
							<br/>
							<br/>
							<span id="enable" onClick={() => this.Opcion("habilitar")}><img src={enable_ICO}  alt=""/> Habilitar</span>
							<br/>
						</div>
					);
				} 
				else if(this.state.status === CLIENTE_STATUS.APAGADO)
				{
					return(
						<div className={styles.iconos}>
							<span id="on" onClick={()=>this.Opcion("encender")}><img src={on_ICO}  alt=""/> Encendido</span>						
						</div>
					);
				}
			}
			else if(this.state.status === CLIENTE_STATUS.TESISTA)
			{  // MAQUINA PARA TEISISTA
				return(
					<div className={styles.iconos}>
						<span id="ci" ><img src={user_ICO}  alt=""/> C.I: {this.state.identificacion}</span>
						<br/>
						<span id="on"><img src={time_ICO}  alt=""/> Tiempo: {this.state.tiempo} </span>
						<br/>
					</div>
				);

			}
			
			
		}


			//TODO QUEDE POR AQUI AYER VIENDO EL FUNCIONAMIENTO DE LOS MODALES
		//! MODALES DEL MODULO
		else if ( this.auth.getConfirm().role === TIPO_USUARIO.MODULO || this.auth.getConfirm().role === TIPO_USUARIO.COORDINACION )
		{
			//?MODALES PARA MODULOS SI ESTAN EN MODO DE RESERVACION
			if(this.state.modo === GESTOR_STATUS.RESERVACION)
			{
				//CLASES
				if(this.state.status === CLIENTE_STATUS.CLASES)
				{  
					return(
						<div className={styles.iconos}>
							<span id="message" onClick={() => this.Opcion("mensaje")}><img src={message_ICO}  alt=""/> Mensaje</span>
							<br/>
							<span id="on" onClick={() => this.Opcion("encender")}><img src={on_ICO}  alt=""/> Encendido</span>
							<br/>
							<span id="off" onClick={() => this.Opcion("apagado")}><img src={off_ICO}  alt=""/> Apagado</span>
							<br/>
							<span id="restart" onClick={() => this.Opcion("reiniciar")}><img src={restart_ICO}  alt=""/> Reiniciar</span>
							<br/>
						</div>
					);
				}
				else if(this.state.status === CLIENTE_STATUS.DISPONIBLE)
				{ //PARA RESERVER
					return(
						<div className={styles.reservar}>
							<form className={styles.form}>
								
								{/*DropDown Button para la Cedula*/}
								<select className={styles.select} 
								id="nacionalidad"
								ref={(ident) => this.tIdentificacion = ident}
								value = {this.state.tIdentificacion}>
									<option value="v" selected>V</option> {/*Venezolano*/}
									<option value="e" >E</option>					{/*Extranjero*/}
								</select>
								<input 
								id="ID"
								className={styles.ingresar}
								type="number" 
								placeholder="Cedula de Identidad"
								value= {this.state.cedula}
								ref={(c) => this.cedula = c}
								/>
								<button 
								onClick={this.onSubmit}
								className={styles.buscar}
								>
									Reservar
								</button>
							</form>
						</div>

					);
				}
				else if(this.state.status === CLIENTE_STATUS.OCUPADO || this.state.status === CLIENTE_STATUS.ESPERA)
				{  // MAQUINA RESERVADA
					return(
						<div className={styles.iconos}>
							<span id="ci" ><img src={user_ICO}  alt=""/> C.I: {this.state.identificacion}</span>
							<br/>
							<span id="on"><img src={time_ICO}  alt=""/> Tiempo: {this.state.tiempo} </span>
							<br/>
						</div>
					);
				}
				else if(this.state.status === CLIENTE_STATUS.APAGADO)
				{  // MAQUINA RESERVADA
					return(
						<div className={styles.iconos}>
							<span id="on" onClick={() => this.Opcion("encender")}><img src={enable_ICO}  alt=""/> Encendido</span>
							<br/>
						</div>
					);
				}
			}
			//?MODALES PARA MODULOS SI ESTAN EN MODO DE CLASES
			else
			{
				if(this.state.status === CLIENTE_STATUS.DISPONIBLE)
				{
					return(
						<div className={styles.iconos}>
							<span id="message" onClick={()=> this.Opcion("mensaje")}><img src={message_ICO}  alt=""/> Mensaje<div></div></span>
							<br/>
							<span id="off" onClick={() => this.Opcion("apagado")}><img src={off_ICO}  alt=""/> Apagado</span>
							<br/>
							<span id="restart" onClick={() => this.Opcion("reiniciar")}><img src={restart_ICO}  alt=""/> Reiniciar</span>
							<br/>
						</div>
					);
				}
				else if(this.state.status === CLIENTE_STATUS.APAGADO)
				{  // MAQUINA APAGADA
					return(
						<div className={styles.iconos}>
							<span id="on" onClick={() => this.Opcion("encender")}><img src={off_ICO}  alt=""/> Encendido</span>
							<br/>
						</div>
					);
				}
			}
		}

		 	return(
		 		<div className={styles.iconos}>
		 			<span id="message" onClick={() => this.Opcion("mensaje")}><img src={message_ICO}  alt=""/> NO TIENES ACCESO</span>
		 			<br/>

		 		</div>

		 	);

	}

	
/*

    render(){
		if(this.state.status === "normal"){

			return(
				<div className={styles.iconos}>
					<span id="enable_ICO" onClick={()=> this.Opcion(0)}><img src={enable_ICO}  alt=""/> Habilitar</span>
					<br/>
					<span id="message_ICO" onClick={()=> this.Opcion(1)}><img src={message_ICO}  alt=""/> Mensaje</span>
					<br/>
					<span id="on_ICO" onClick={()=> this.Opcion(2)}><img src={on_ICO}  alt=""/> Encendido</span>
					<br/>
					<span id="restart_ICO" onClick={()=> this.Opcion(3)}><img src={restart_ICO}  alt=""/> Reiniciar</span>
					<br/>
					<span id="off_ICO" onClick={()=> this.Opcion(4)}><img src={off_ICO}  alt=""/> Apagado</span>
					<br/>
					<span id="bonus_ICO" onClick={()=> this.Opcion(5)}><img src={bonus_ICO}  alt=""/> Extender</span>
					<br/>
				</div>
				
			);
		}else if(this.state.status === "disponible"){

			return(
				<div className={styles.iconos2}>
					<input type="text" placeholder="Cedula de Identidad"/>
					<button 
						onClick={this.handleClick}
						className={styles.buscar}
						>
							Reservar
						</button>
				</div>

			);
		}else if(this.state.status === "ocupado"){

			return(
				<div className={styles.iconos3}>
					<div>C.I: 27137060</div>
					<span>Tiempo: +45</span>
				</div>
			);

		}else if(this.state.status === "noreservada"){

			return(
				<div className={styles.iconos}>
					<span id="message_ICO" onClick={()=> this.Opcion(1)}><img src={message_ICO}  alt=""/> Mensaje</span>
					<br/>
					<span id="on_ICO" onClick={()=> this.Opcion(2)}><img src={on_ICO}  alt=""/> Encendido</span>
					<br/>
					<span id="restart_ICO" onClick={()=> this.Opcion(3)}><img src={restart_ICO}  alt=""/> Reiniciar</span>
					<br/>
					<span id="off_ICO" onClick={()=> this.Opcion(4)}><img src={off_ICO}  alt=""/> Apagado</span>
					<br/>
				</div>

			);
		}

		
	}*/
}