import React, { Component } from "react";

import style from "./horarios.module.css";
class Horarios extends Component {
  constructor() {
    super();
    this.state = {
    };

    
  }
  componentDidMount(){
  }
  render() {
    return (
        <p className={style.texto}>Muy Pronto Estará Disponible</p>
    );
  }
}

export default Horarios;