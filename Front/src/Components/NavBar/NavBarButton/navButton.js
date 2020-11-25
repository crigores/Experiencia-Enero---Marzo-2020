import React, { Component } from "react";
//CSS
import style from "../navbar.module.css"
//COMPONENTES
import { Link } from "react-router-dom";
class Navbutton extends Component {
  constructor(props) {
    super();
    this.state = {
      direction: props.value.direction,
      name: props.value.name,
    };

    
  }

  render() {
    return (
      <li key= {`${this.state.name}`} className={style.navButton}>
        <Link to={this.state.direction} replace  className="nav-link">
          {this.state.name}
        </Link>
      </li>
    );
  }  
} 

export default Navbutton;
