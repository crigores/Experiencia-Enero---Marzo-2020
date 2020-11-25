import React, { Component } from 'react';
import style from './Cinfo.module.css';
import monitor from '../Img/monitor.png';

class Cinfo extends Component{
  constructor() {
    super();
    this.state = {
    };
	}
	
	render(){
		return(
			<div>
				<header>
					<h2>Aquí se debería apreciar el Contenido Cliente</h2>
				</header>
				<aside>
					<img className={style.img} src={monitor} alt="m"/>
				</aside>
				<section>
					{/* AQUI VA LA IMAGEN */}
					<h3>COMPUTADORA EN ESPERA </h3>
					<p> 
					A través del gestor ubicado en planta baja rectorado, el preparador podrá deshabilitar el equipo colocándolo en estado de espera, 
					esto indicará a M.A.G.I que hay otro equipo disponible para reservar.
					</p>
					
					{/* AQUI VA LA IMAGEN */}
					<h3>INGRESO DE CÉDULA</h3>
					<p>
					El usuario deberá ingresar la cédula con la que realizó la reservación previamente para así poder activar la computadora.
					</p>

					<h3>MENSAJE DE ADVERTENCIA</h3>
					{/* AQUI VA LA IMAGEN */}
					<p>
					Al quedar poco tiempo de uso en la máquina el sistema mostrará al usuario dos advertencias: una notificando que le restan 15 minutos, 
					y otra 5 minutos antes de que el sistema bloquee el equipo. Esta última le ofrece al usuario evitar pérdidas de información y tomar sus previsiones necesarias.
					</p>
				</section>
			</div>
		);
	}
}
export default Cinfo;