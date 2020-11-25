import React, {Component}from 'react';
//SEGURIDAD
import {CLIENTE_STATUS} from '../../variables-entorno';
//css
import styles from './maquina.module.css';
//COMPONENTES
import Modal from '../Modals/Modal-PC/modal';
// ICONOS
import imgPc from './img/monitor.svg'; 


let hermano = "";
let tag;
//const ESTADOS = [0,1,2,3];
class Maquina extends Component{
	constructor(props) {
		super(props);
		this.state = {
			name: props.name,
			id: props.id,
			status: props.status,
			salon: props.salon,
			modo: props.modo,
			tiempo: props.tiempo,
			extencion: props.extencion,
			cedula: props.cedula,
		}
		this.changeColor = this.changeColor.bind(this);
	}

	componentDidMount(){
		if(this.state.status !== "vacio")
			this.changeColor(this.state.id, this.state.status);
	}
	
	componentWillUpdate(nextProps, nextState){
		
		if(this.props.salon !== nextProps.salon || this.props.status !== nextProps.status || this.props.modo !== nextProps.modo )
		{
			this.setState({
				name: nextProps.name,
				id: nextProps.id,
				status: nextProps.status,
				salon: nextProps.salon,
				modo: nextProps.modo,
				cedula: nextProps.cedula,
			}, () => {
				if(nextProps.status !== "vacio") 	
					this.changeColor(nextProps.id,nextProps.status);
			});
			
		}	
	} 

	
	//CAMBIA EL COLOR DE LAS MAQUINAS
	changeColor(id,status){
		let color;
		 
		if(CLIENTE_STATUS.CLASES === status)
			color = "#24960A";
		else if(CLIENTE_STATUS.DISPONIBLE === status)
			color = "#2ED309";
		else if(CLIENTE_STATUS.OCUPADO === status)
			color = "#D90A0A";
		else if(CLIENTE_STATUS.ESPERA === status)
			color = "#E8EB07";
		else if(CLIENTE_STATUS.ADVERTENCIA_1 === status)
			color = "#B80E00";
		else if(CLIENTE_STATUS.ADVERTENCIA_2 === status)
			color = "#850B01";
		else if(CLIENTE_STATUS.TESISTA === status)
			color = "#000000";
		else if(CLIENTE_STATUS.EXTENCION === status)
			color = "#F56800";
		else if(CLIENTE_STATUS.APAGADO === status)
			color = "#1C1C1C";
			
		document.getElementById(id).style.backgroundColor = color;
		
	}
  
	handleClick(e){
		e.preventDefault();

		if(hermano !== ""){
				hermano.style.display = "none";
		}

		if(e.target.id === tag){
			hermano.style.display = "none";
			tag++;
		}else{
			tag = e.target.id;
			hermano = document.getElementById(tag).nextSibling;
			hermano.style.display = "block";

			if(window.event.clientX >= 905){
				hermano.style.left = "-150px";
			}
		}
	
	}

	
	render(){

		//RENDERIZA VACIO
		if(this.state.status === "vacio")
		{
			return(
				<div className={styles.vacio}>
				</div>
			);
		}
		//RENDERIZA MAQUINA
		else
		{
			return(
				<div className={styles.component}>
					<header >
						<img src={imgPc} alt="logo"/>
					</header>

					<section onClick={this.handleClick} id={this.state.id} className={styles.seccion}>
						{this.state.name}
					</section>
					<Modal tiempo= {this.state.tiempo} 
					extencion= {this.state.extencion} 
					nombre={this.state.name} 
					salon ={this.state.salon} 
					id={this.state.id} 
					modo={this.state.modo} 
					status={this.state.status}
					cedula={this.state.cedula}/>
					
				</div>
			);
		}
	}
}


export default Maquina;