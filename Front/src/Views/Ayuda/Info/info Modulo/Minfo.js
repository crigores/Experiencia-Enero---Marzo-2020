import React, { Component } from 'react';
import style from './Minfo.module.css';

import acceso from '../Img/modulo/acceso.PNG';
import modulo from '../Img/modulo/modulo.PNG';
// import modulodos from '../Img/modulo/modulodos.PNG';
// import modulotres from '../Img/modulo/modulotres.PNG';
// import modulocuatro from '../Img/modulo/modulocuatro.PNG';
// import modulocinco from '../Img/modulo/modulocinco.PNG';
// import moduloseis from '../Img/modulo/moduloseis.PNG';
// import modulosiete from '../Img/modulo/modulosiete.PNG';

class Minfo extends Component{
  constructor() {
    super();
    this.state = {
    };
	}
	
	render(){
		return(
			<div>
				<header>
					<h2>Aquí se debería apreciar el Contenido Módulos</h2>
				</header>
				<aside>
					<img className={style.img} src={modulo} alt="m"/>
				</aside>
				<section>
					<h3>ACCESO AL SISTEMA</h3>
					<p> 
						Para acceder al Módulo Administrativo Gestor de Interconexiones se ingresa en la siguiente dirección electrónica http://magi:6950/modulo.
					</p>
					<aside>
						<img className={style.img} src={acceso} alt="m"/>
					</aside>
					<p>
					Una vez cargada la página se encuentran diversas opciones, cada una de ellas tiene una funcionalidad distinta 
					pero que trabajan conjuntamente para llevar a cabo una buena  gestión y lograr que el sistema trabaje correctamente.
					</p>

					<h3>SISTEMA DE RESERVACION</h3>

					<p>
						Ingresando una cédula de identidad al sistema de reservación y presionando “INGRESAR” se reserva automáticamente una 
						máquina en el laboratorio de computación ubicado en planta baja (rectorado). El sistema envía al gestor la información 
						del usuario que ha reservado una computadora, esto con el fin de ubicar al usuario en el equipo correspondiente en caso 
						de que éste olvide el número de máquina asignada por el sistema.
					</p>

					<h3>NÚMERO DE MÁQUINAS DISPONIBLES</h3>
					<p>
					Esta opción indica cuantas máquinas se encuentran en estado de disponibilidad a la espera de una reservación en el 
					laboratorio de computación en planta baja. Al reservar una máquina, el número de disponibilidad irá disminuyendo conforme se vaya reservando. 
					</p>

					<h3>ÚLTIMA RESERVADA</h3>
					<p>
					En esta área se refleja el nombre de la computadora que fue reservada por algún usuario. Al reservar una computadora el sistema arroja 
					aleatoriamente un número de máquina que será el asignado para el usuario.
					</p>

					{/* AQUI VA LA IMAGEN */}

					<p>
						En la imagen se puede observar que la última reservada fue la INT-22, esto indica a su vez el nombre del equipo asignado.
					</p>
				</section>
			</div>
		);
	}
}

export default Minfo;