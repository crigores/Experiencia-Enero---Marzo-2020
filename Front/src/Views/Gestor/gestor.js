import React, {Component} from "react";
//SEGURIDAD Y COMUNICACION
import Auth from "../../Components/auth";
import Socket from "../../socket";
import { TIPO_USUARIO } from "../../variables-entorno";
//COMPONENTES
import Contenedor from "../../Components/Grid/contenedor";
//CSS
import styles from "./gestor.module.css";
//ICONOS
import logoMagi from "./img/MAGI-logo.svg";



let _booleano= false;
export default class Gestor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datos: '',
      salon: '',
	};
  this.auth = new Auth();
  this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    let x = document.getElementById("ID").value;
    
    for (let i = 0; i< this.state.datos.maquina.length; i++)
    {
      if(this.state.datos.maquina[i].ESTUDIANTE.toString() === x.toString() )
      {
        alert("LA CEDULA PERTENECE A LA " + this.state.datos.maquina[i].MAQUINA);
        break;
      }
    }
    
  }

  componentWillUnmount(){
    _booleano = false;
  }

  componentDidMount() {
    if (
      this.auth.getConfirm().role === TIPO_USUARIO.GESTOR ||
      this.auth.getConfirm().role === TIPO_USUARIO.COORDINACION
    ) {
      this.auth.refresh();
      Socket.emit(
        "GESTOR-SALON",
        this.auth.getTokenValue().piso,
        this.auth.getTokenValue().salon
      );
	  
      Socket.on("GESTOR-SALON", array => {
        _booleano = true;
        this.setState({datos: array, salon:this.auth.getTokenValue().salon});
        
      });
    } else this.props.history.replace("/inicio");
  } 

  render() { 
  
    if(_booleano){
      return (
        <div className={styles.container}>
          <header>
            <img className={styles.logo} src={logoMagi} alt="logo" />
            <form id="FORM" autoComplete="off" onSubmit={this.busquedaCedula} className={styles.form}>
              {/*DropDown Button para la Cedula*/}
              <select className={styles.select} id="nacionalidad">
                <option value="v" defaultValue>V</option>{/*Venezolano*/}
                <option value="e">E</option> {/*Extranjero*/}
              </select>
              <input
                id="ID"
                autoComplete="off"
                className={`${styles.ingresar} ${styles.barra_perfecta}`}
                type="number"
                placeholder="Cedula de Identidad"
              ></input>
              <button onClick={this.handleClick} className={styles.buscar}>
                Buscar
              </button>
            </form>
          </header>
  
          <div id="boxx" className={styles.box}>

          <Contenedor datos={this.state.datos} salon={this.state.salon}/>
          </div>
        </div>
      );
    }
    return(<h1>CARGANDO</h1>);
    
  }
}
