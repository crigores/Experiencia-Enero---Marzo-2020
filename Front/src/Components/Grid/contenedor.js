import React, {Component} from 'react';
//COMPONENTES
import Maquina from './maquina';
//CSS
import styles from '../Grid/pisos.module.css'; 


export default class Contenedor extends Component{
	constructor(props){
		super(props);
		this.state = {
			list: [],
			grid: props.datos.grid,
			maquinas: props.datos.maquina,
			salon: props.salon,
			modo: props.datos.modo,
			tiempo: props.datos.tiempo,
			extencion: props.datos.extencion
		}
	} 
   
	//Cuando el Componente esté Iniciado Verifica el Arreglo (Numero de Computadoras / Nombre) y Muestra los "Blanks Spaces"
	componentDidMount(){
		// Control de tamaño de Grid de los distintos salones
		document.getElementById("boxx").firstChild.style.gridTemplateColumns = this.state.grid;
		let nombre;
		this.setState({
			modo: this.state.modo,
			list: this.state.maquinas.map(item=>{
				
				if(item === 'vacio'){
					
					return <Maquina name={null} id={null} status={"vacio"} salon={null}/>
				}

				nombre = item.MAQUINA.split("-");

				return(
					//Funcion para Enviar el ITEM y Recibirlo en Componente / PC
					
					<Maquina name={nombre[1]} 
					id={item.MAQUINA} 
					cedula={item.ESTUDIANTE} 
					tiempo = {this.state.tiempo} 
					extencion = {this.state.extencion} 
					status={item.STATUS} 
					salon={this.state.salon}
					modo ={this.props.datos.modo}/>
				);
			}),
			grid: this.state.grid,
		});
	}


	componentDidUpdate(prevProps) {
		if(this.props.datos.maquina !== prevProps.datos.maquina )
		{

			document.getElementById("boxx").firstChild.style.gridTemplateColumns= this.props.datos.grid;
			this.setState({
				modo: this.props.datos.modo,
				list: this.props.datos.maquina.map(item=>{
					if(item === 'vacio')
					{
						return <Maquina name={null} id={null} status={"vacio"} salon={null}/>
					}
					let nombre;
					nombre = item.MAQUINA.split("-");

					return(
						<Maquina cedula={item.ESTUDIANTE} name={nombre[1]} id={item.MAQUINA} status={item.STATUS} salon={prevProps.salon} modo ={this.props.datos.modo}/>
					);
				}),
				grid: this.props.datos.grid,
			});
		}
	  } 

	render(){
		return(
			<div className={styles.contenedor}>
				{this.state.list}
			</div>
    );        
  }
}

