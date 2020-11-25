import React,{Component} from "react";
//SEGURIDAD Y COMUNICACION
import { GESTOR_STATUS } from "../../variables-entorno";

export default class Salones extends Component {
    constructor(props) {
      super(props);
      this.state = {
        name: props.name,
        id: props.id,
        status: props.status,
        piso: props.piso,
        callback: true,
        SalonAccion: props.accion
      };
      this.handleClick = this.handleClick.bind(this);    
    }

    handleClick(e) {
      e.preventDefault();
      document.getElementById("nombreSalon").innerHTML = this.state.name;
      this.state.SalonAccion(this.state.status);

    }
  
    componentDidMount() {
      if (this.state.status === GESTOR_STATUS.APAGADA) {
        document.getElementById(this.state.id).style.color = "black";
        document.getElementById(this.state.id).style.border = "3px solid black";
      }
      else if (this.state.status === GESTOR_STATUS.CLASES) {
        document.getElementById(this.state.id).style.color = "green";
        document.getElementById(this.state.id).style.border ="3px solid green";
      }
      else if (this.state.status === GESTOR_STATUS.RESERVACION) {
        document.getElementById(this.state.id).style.color = "blue";
        document.getElementById(this.state.id).style.border ="3px solid blue";
      }  
      
    }
  
    componentWillUpdate(nextProps, nextState) {
      if (this.state.name !== nextProps.name || this.state.status !== nextProps.status) 
      {
        this.setState({
          name: nextProps.name,
          status: nextProps.status,
          id: nextProps.id
        },()=>{
          if (this.state.status === GESTOR_STATUS.APAGADA) {
            document.getElementById(this.state.id).style.color = "black";
            document.getElementById(this.state.id).style.border = "3px solid black";
          }
          else if (this.state.status === GESTOR_STATUS.CLASES) {
            document.getElementById(this.state.id).style.color = "green";
            document.getElementById(this.state.id).style.border ="3px solid green";
          }
          else if (this.state.status === GESTOR_STATUS.RESERVACION) {
            document.getElementById(this.state.id).style.color = "blue";
            document.getElementById(this.state.id).style.border ="3px solid blue";
          } 
          //pendiente del 69
          if(this.state.status === 99){
            document.getElementById(this.state.id).style.border = "0px solid white";
            document.getElementById(this.state.id).style.borderTop = "3px solid white";
            document.getElementById(this.state.id).style.borderRight = "3px solid white";
          }
        });        
      }
    }
  
    render() {
      if (this.state.id === "M") {
        this.setState({id: "Modulo"})
      }
      return (
        <div
          name={this.state.name}
          status={this.state.status}
          id={this.state.id}
          onClick={this.handleClick}
        >
          {this.state.name}
        </div>
      );
    }
  }
  