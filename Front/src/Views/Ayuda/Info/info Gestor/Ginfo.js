import React, { Component } from 'react';

import style from './Ginfo.module.css';

import acceso from '../Img/gestor/acceso.PNG';
// import gestor2 from '../Img/gestor/gestor2.PNG';
// import gestor3 from '../Img/gestor/gestor3.PNG';
// import gestor4 from '../Img/gestor/gestor4.PNG';

class Ginfo extends Component{
  constructor() {
    super();
    this.state = {
    };
  }

	render(){
		return(
			<div>
				<header>
					<h2>Aquí se debería apreciar el Contenido Gestor</h2>
				</header>
				<aside>
					<img className={style.img} src={acceso} alt="m"/>
				</aside>
				<section>
					<h3 >GESTOR DE RESERVACIÓN</h3>
					<p> 
					El gestor de reservación tiene diversas funciones para ofrecer, así como la verificación de usuarios en el sistema 
					y brindarle información a éste sobre qué computadora ha sido asignada; deshabilitar equipos colocándolos en modo de espera, 
					entre otros. 
					</p>

					{/* AQUI VA LA IMAGEN */}
					<p>
					El gestor informa a través de una secuencia de colores el estado de la computadora, es decir, el tiempo restante del equipo.						
					</p>

					{/* AQUI VA LA IMAGEN */}
					<p>
					El color vino tinto indica que el tiempo de reservación esta por acabarse y que tiene entre 5 a 15 minutos aproximadamente previos al bloqueo del computador.
					</p>

					{/* AQUI VA LA IMAGEN */}
					<p>
					El color amarillo indica que debe ingresar la cédula del usuario que reservó para poder activar el equipo. El tiempo límite de reservación consta de una hora. 
					El temporizador se pondrá en marcha una vez que la cédula haya sido ingresada.
					</p>

					{/* AQUI VA LA IMAGEN */}
					<p>
					El color rojo indica que al usuario le restan 45 minutos para poder utilizar la computadora.
					</p>

				</section>
			</div>

		);
	}
}

export default Ginfo;