import React, { Component } from 'react';

class Info extends Component{
  constructor() {
    super();
    this.state = {
    };
  }

	render(){
		return(
			<div>
				<header>
					<h2>INTRODUCCION M.A.G.I.</h2>
				</header>
				<section>
					<p> 
						M.A.G.I tiene como finalidad  gestionar los procesos de reservación de las computadoras en los laboratorios de computación de la Universidad Dr. Rafael Belloso Chacín, 
						todo esto para brindar un mejor servicio de disponibilidad a los usuarios. Así como también disminuir el tiempo de espera del computador por parte de estudiantes y docentes.
					</p>
					<p>
						M.A.G.I se encuentra en comunicación con el laboratorio de computación de planta baja (rectorado) y también del primer piso del bloque F, 
						ya que en este último se encuentra el módulo donde los estudiantes reservan un computador ubicado en planta baja rectorado.
					</p>
				</section>
			</div>

		);
	}
}

export default Info;