//!TO DELETE
/*
import React, { Component } from "react";
import { TIPO_IDENTIFICAION } from "../../CONST";
import socket from "../../Socket";
import Auth from "../../Components/Auth";
import { TipoUsuario } from "../../Recursos";

class Reservaciones extends Component {
  constructor() {
    super();

    this.state = {
      cedula: "",
      response: "",
      disponibilidad: "0",
      manquinaReservada: "Esperando maquina",
      habilitado: false
    };
    this.onChange = this.onChange.bind(this);
    this.verificar = this.verificar.bind(this);
    this.onClick = this.onClick.bind(this);
    // this.handleClick = this.handleClick.bind(this);
    this.auth = new Auth();
  }
  onClick() {
    console.log(this.menu.value + this.state.cedula);
    if (
      this.menu.value === TIPO_IDENTIFICAION[0] ||
      this.menu.value === TIPO_IDENTIFICAION[1]
    ) {
      this.setState({ habilitado: false });
      socket.emit(
        "MODULO-ASIGNACION",
        this.state.cedula,
        this.menu.value,
        "1F",
        "F-6",
        (valida, msg, maquina) => {
          if (valida) {
            this.setState({ manquinaReservada: maquina });
            // Y SI SE HACE UNA PANTALLA DE CARGA? xd gid no
          } else {
            alert(msg);
          }
          this.setState({ habilitado: true });
        }
      );
    } else {
      console.log("RECARGANDO LA PAGINA, TRAVIESO");
    }
  }

  onChange(e) {
    console.log([e.target.name]);
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount() {

    if (this.auth.getConfirm().role === TipoUsuario.MODULO || this.auth.getConfirm().role === TipoUsuario.COORDINACION) {
      setTimeout(() => {
        this.setState({ habilitado: true });
      }, 10000);
      //Listen for data on the "outgoing data" namespace and supply a callback for what to do when we get one. In this case, we set a state variable

      socket.on("MODULO-BLOQUEO-BOTON", booleano => {
        if (booleano) {
          this.setState({ habilitado: true });
        } else {
          this.setState({ habilitado: false });
        }
      });

      //Cantidad de maquinas disponibles para usar
      socket.on("MODULO-MAQUINAS-DISPONIBLES", data => {
        console.log(data);
        this.setState({ disponibilidad: data });
      });
    }
    else{
      this.props.history.replace('/inicio');
    }
  }

  verificar(e) {
    if (this.state.cedula.length > 3) {
      console.log("entreh");
    }
  }

  render() {
    return (
      <div>
        <div className="App">
          <h1>MAQUINAS DISPONIBLES</h1>
        </div>
        <div>
          -------->Cedula:
          <select id="dropdown" ref={input => (this.menu = input)}>
            <option value="V">V</option>
            <option value="AP">AP</option>
          </select>
          <input
            name="cedula"
            type="text"
            value={this.state.cedula}
            onChange={this.onChange}
          />
          <button
            type="button"
            id="boton"
            disabled={
              !/^([0-9])*$/.test(this.state.cedula) ||
              this.state.cedula.length < 6 ||
              !this.state.habilitado
            }
            onClick={this.onClick}
          >
            {" "}
            press me
          </button>
        </div>
        <div>
          <h1>Maquinas disponibles</h1>
          <h2>{this.state.disponibilidad}</h2>
        </div>
        <div>
          <h1>Maquina reservada</h1>
          <h2>{this.state.manquinaReservada}</h2>
        </div>
      </div>
    );
  }
}

export default Reservaciones;
*/