import React, { Component } from "react";
//COMPONENTES
import { Link } from "react-router-dom";
//CSS
import style from '../navbar.module.css';
class DropDownButton extends Component {
  constructor(props) {
    super();
    this.state = {
      nombreBoton : props.nombre,
      array: props.array.map(salon => {
       return <Link key={salon} to={`/${props.link}/${salon}`}>{salon}</Link>;
      })
    };
  }

  render() {
    return (
      
        <li key={`${this.state.nombreBoton}-1`} className={style.dropdown}>
          <Link to="#" className={style.dropbtn}>
            {this.state.nombreBoton}
          </Link>
          <div className={style.dropdown_content}>{this.state.array}</div>
        </li>
      
    );
  }
}
 
export default DropDownButton;
