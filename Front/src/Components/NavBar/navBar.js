import React, { Component } from "react";
//SEGURIDAD Y COMUNICACION
import Auth from "../auth";
import Socket from "../../socket";
import {TIPO_USUARIO} from "../../variables-entorno";
//COMPONENTES
import { Link } from "react-router-dom";
import {option} from "./option";
//CSS
import style from "./navbar.module.css";


class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      usuario: "1F",
      content: "",
      botones: [],
      _booleano: true,
    };
    this.auth = new Auth();
    this.desconectar = this.desconectar.bind(this);

  }

  componentDidMount() {

    
    if (this.auth.loggedIn()) 
    {

      if(this.state._booleano){
        setTimeout( ()=>{
        this.auth.socketValidation(Socket.id,this.auth.getConfirm().role)
        this.setState({_booleano : false});
        },900); 
      }
      
     

      if(this.auth.getConfirm().role === TIPO_USUARIO.GESTOR)
      {
        this.setState({
          botones: option(this.auth.getConfirm().role, this.auth.getTokenValue().salones, this.auth.getTokenValue().salon)
        });
        document.getElementsByTagName("body")[0].style.backgroundImage = "url('/Fondo-Gestor.jpg')"; 
      }
      else if(this.auth.getConfirm().role === TIPO_USUARIO.MODULO )
      {
        this.setState({
          botones: option(this.auth.getConfirm().role, this.auth.getTokenValue().salones, this.auth.getTokenValue().salon)
        });
        document.getElementsByTagName("body")[0].style.backgroundImage = "url('/Fondo-Modulo.jpg')";
      }  
      else
      {
        this.setState({
          botones: option(this.auth.getConfirm().role, this.auth.getTokenValue().pisos, this.auth.getTokenValue().salon)
        });
       document.getElementsByTagName("body")[0].style.backgroundImage = "url('/Fondo-Coordinacion.png')";
      }
      document.getElementsByTagName("body")[0].style.backgroundSize = "100vw 100vh";
    }

    Socket.on("MODULO-MSJ", msj => {
      alert(msj);
    });
  }

  desconectar() {
    this.auth.logout();
    this.props.history.replace("/login");
    window.location.reload(true);
  }

  render() {
    return (
      <nav className={style.navbar2} id="letras"> {/*nabar */}
        <Link to="/inicio" className={style.ico_inicio} ></Link>

        <div className={style.botones} id="navbarNavDropdown"> 
          {
            /*BOTONES DE NAVEGACION*/
            this.state.botones
          }
        </div>

        <Link to="/login" onClick={this.desconectar} id="letras" className={style.ico_salida}> </Link>
      </nav>
    );
  } 
}

export default Navbar;
