import React, { Component } from "react";
//COMPONENTES
import { Link } from "react-router-dom";
 
class DrawerButton extends Component {
  constructor(props) {
    super();
    this.state = {
      nombreBoton: props.value.nombreBoton,
      direccion: props.value.direccion,
      icono: props.value.icono
    };
  }

  render() {
    return (
      <li key={this.state.nombre} className="nav-item">
        <Link className="nav-link" to={this.state.direccion}>
          {this.state.nombre}
        </Link>
      </li>
    );
  }
} 

export default DrawerButton;
