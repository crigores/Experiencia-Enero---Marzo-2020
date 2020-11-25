import React, { Component} from "react";
//SEGURIDAD Y COMUNICACION
import Auth from "../../Components/auth";
import Socket from "../../socket";
import { TIPO_USUARIO } from "../../variables-entorno";
import style from './modulo.module.css';
import ico_encendido from '../../Components/Grid/img/on-icon.svg';
import ico_apagado from '../../Components/Grid/img/off-icon.svg';
import ico_reiniciar from '../../Components/Grid/img/restart-icon.svg';

//COMPONENTES
import Contenedor from "../../Components/Grid/contenedor";

//CSS
import styles from "../Gestor/gestor.module.css";

let _booleano= false;
class Salones extends Component {
  constructor(props) {
    super(props);
    this.auth = new Auth();
    this.state = {
      piso: this.auth.getTokenValue().piso,
      salon: this.props.history.location.pathname.split("/")[2],
      callback: true,
    };
    this.click = this.click.bind(this);
   
  }
  
 
  componentWillUnmount(){
    _booleano = false;
  }
  componentDidMount() {
    if (
      this.auth.getConfirm().role === TIPO_USUARIO.MODULO ||
      this.auth.getConfirm().role === TIPO_USUARIO.COORDINACION
    ) {
      this.auth.refresh();
      this.setState({ salon: this.props.history.location.pathname.split("/")[2] });
      Socket.emit(
        "MODULO-SALON",
        this.auth.getTokenValue().piso,
        this.state.salon
      );
      _booleano = false;

      //! CUANDO SE CAMBIA DE UN SALON A OTRO COMPONENTE FUERA DE LOS SALONES, RESOLVER!!!
      Socket.on("MODULO-SALON", array => {
        _booleano = true;
        this.setState({ datos: array, salon: this.state.salon });
      });
    } else this.props.history.replace("/inicio");
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(prevState.salon !== nextProps.history.location.pathname.split("/")[2]){
      Socket.emit(
        "MODULO-SALON",
        prevState.piso,
        nextProps.history.location.pathname.split("/")[2]
      );
      return { salon: nextProps.history.location.pathname.split("/")[2] };
    }
    return null;
  }
  click(opcion){
    const {piso, salon} = this.state;
    let r
    if(this.state.callback)
	   {
		  this.setState({callback:false},()=>{
        switch(opcion){
          case "encender":
            Socket.emit('CLIENTE-ACCION-GLOBAL', piso, salon, opcion, null, (bool) =>{ if(bool) this.setState({callback:true})});
            break;

          case "apagado":
            r= prompt("si quieres apagar este equipo escribe la palabra: \"apagado\" ");
            if (r.localeCompare("apagado") === 0 ) 
            {
              Socket.emit('CLIENTE-ACCION-GLOBAL', piso, salon, opcion, null, (bool) =>{ if(bool) this.setState({callback:true})});
            } else this.setState({callback:true})
            break;
          
          case "reiniciar":
            r = prompt("si quieres apagar este equipo escribe la palabra: \"reiniciar\"");
            
            if (r.localeCompare("reiniciar") === 0 ) 
            {
              alert(r);
              Socket.emit('CLIENTE-ACCION-GLOBAL', piso, salon, opcion, null, (bool) =>{ if(bool) this.setState({callback:true})});
            } else this.setState({callback:true})
            break;

            default:
              break;

        }
    });
  }
  }

  render() {
    if(_booleano){
      return (
        <div className={styles.container}>
          <h1>{this.state.salon}</h1>
  
          <div id="boxx" className={styles.box}>
            <Contenedor datos={this.state.datos} salon={this.state.salon} />
            
            <section className={style.botones}>
              <div>
                <img src={ico_encendido} onClick={ () =>this.click("encender")} alt=""/>
                <p>Encendido</p>
              </div>
              <div>
                <img src={ico_apagado} onClick={ () =>this.click("apagado")} alt=""/>
                <p>Apagado</p>
              </div>
              <div>
                <img src={ico_reiniciar} onClick={ () =>this.click("reiniciar")} alt=""/>
                <p>Reiniciar</p>
              </div>
              
              
              
            </section>
          </div>
        </div>
      );
    }
    return(<h1>CARGANDO</h1>);
    
  }
}

export default Salones;
