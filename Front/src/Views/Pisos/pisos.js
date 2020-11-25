import React, {Component} from "react";
//COMPONENTES
import ModalReservacion from '../../Components/Modals/Modal-Reservacion/modal_reservacion';
import Salones from "./salones";
//SEGURIDAD Y COMUNICACION
import Socket from "../../socket";
import Auth from "../../Components/auth";
import { TIPO_USUARIO } from "../../variables-entorno";
//CSS
import styles from "./pisos.module.css";


let _booleano= false;
export default class Pisos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      status: props.status, 
      estilo: styles.contenedor,
      name:'',
      piso: this.props.history.location.pathname.split("/")[2],
      callback: true
    };
    this.SalonAccion = this.SalonAccion.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.auth = new Auth();
  }

  componentWillUnmount(){
    _booleano = false;
  }

  

  componentDidMount() {
    if (this.auth.getConfirm().role === TIPO_USUARIO.COORDINACION) 
    {
        Socket.emit("COORDINACION-PISO", this.state.piso);
        _booleano = false;

        Socket.on("COORDINACION-PISO", datos => {
          //TODO ARREGLAR
          console.clear();
          console.log(datos);
          let est;
          _booleano = true;
          if (this.state.piso === "1F" || this.state.piso === "2F") est = styles.contenedor;

          if (this.state.piso === "2G") est = styles.contenedor2;
          
          if (this.state.piso === "PB" || this.state.piso === "1G" || this.state.piso === "3G") est = styles.contenedor3;
          
          this.setState({
            list: datos.map(item => {
              return <Salones name={item.nombre} id={item.nombre} status={item.status} piso={this.state.piso} accion={this.SalonAccion} />
            }),
            estilo: est,
          });

        });
    }
  }

  componentWillUpdate(nextProps, nextState) {

    if(nextState.piso !== nextProps.history.location.pathname.split("/")[2]){
        _booleano = false;
         Socket.emit("COORDINACION-PISO", nextProps.history.location.pathname.split("/")[2]);
         this.setState({
          piso: nextProps.history.location.pathname.split("/")[2]
        });
     }
    // return null;
  }

  handleClick(e){
    /**
     * MUESTRA MODALES DE LOS SALONES PARA PODER INTERACTUAR CON ELLOS
     */

    if( document.getElementById("nombreSalon").innerHTML !== '' 
        &&  document.getElementById("nombreSalon").innerHTML !== "M")
    {
      document.getElementById('modal').style.display="block";
    }else if(document.getElementById("nombreSalon").innerHTML === "M") 
    {
      let msj = prompt("Envie mensaje al Modulo");
      console.log(msj)
      if(msj !== null && msj !== undefined && msj !== '' && msj.length > 0)
      {
        Socket.emit("MODULO-MSJ", this.state.piso, msj, (bool)=>{
          if (bool) alert("Mensaje ha sido enviado correctamente");
          else if(!bool) alert("Ha ocurrido un error, modulo apagado o fuera de servicio");
          else alert("Ha ocurrido un error");
        });   
      }
      document.getElementById("nombreSalon").innerHTML = '';
    }  

  }

  SalonAccion(estado){
    this.setState({status: estado});
  }
  

  render() {
    if(_booleano){
      return (
        <div>
          <ModalReservacion  status={this.state.status} piso={this.state.piso}/>
          <div className={this.state.estilo} id="contenedorPisos" onClick={this.handleClick} >
            {this.state.list}
          </div>
        </div>
      );
    }
    return(<h1>LOADING</h1>)
  }
}
