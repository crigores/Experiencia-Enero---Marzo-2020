import React, { Component } from "react";
import style from './ayuda.module.css';
import Minfo from './Info/info Modulo/Minfo';
import Ginfo from './Info/info Gestor/Ginfo';
import Cinfo from './Info/Info Cliente/Cinfo';
import Info from './Info/Info Introduccion/Intro';
import { Link } from "react-router-dom";

class Ayuda extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  }
  handleSubmit(e){
    e.preventDefault();
    
  }

  render() {
    return (
      <div className={style.container}>
        <aside className={style.aside}>
          <ul>
            <span>
              <Link>MAGI</Link>
            </span>
            <li>
              <Link onClick={() =>window.location.href = "#Info"} to='#introduccion'  replace >
                Introducion MAGI
              </Link>
            </li>
            <li>
              <Link onClick={() =>window.location.href = "#Minfo"} to='#acceso-al-sistema'  replace  >
                Acceso al Sistema
              </Link>
            </li>
            <li>
              <Link onClick={() =>window.location.href = "#Ginfo"} to='#sistema-de-reservaciones'  replace>
                Sistema de Reservaciones
              </Link>
            </li>
            <li>
              <Link onClick={() =>window.location.href = "#Cinfo"} to='#gestor'  replace >
                Gestor
              </Link>
            </li>
          </ul> 
        </aside>

        <div className={style.documentacion}>
          <section id="Info" className={style.seccion_principal}>
            <Info/>
          </section>
          <section id="Minfo" className={style.seccion_principal}>
            <Minfo/>
          </section>
          <section id="Ginfo" className={style.seccion_principal}>
            <Ginfo/>
          </section>
          <section id="Cinfo" className={style.seccion_principal}>
            <Cinfo/>
          </section>
        </div>
      </div>

    );
  }
}

export default Ayuda;