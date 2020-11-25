import React, { Component } from "react";
import Auth from "../../Components/auth";


class Registro extends Component {
  constructor(props) {
    super();
    this.state = {
      username: "",
      password: "",
      tipodesuario: ""
    };

    this.auth = new Auth();
    //this.validate = this.validate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onChange(e) {
    //@TODO VALIDAR EN EL BACK
    this.setState({ [e.target.name]: e.target.value });
  }
  onClick() {}

  onSubmit(e) {

    e.preventDefault();

    const user = {
      username: this.state.username,
      password: this.state.password,
      typeUser: this.state.tipodesuario
    };

    this.auth.register(user).then(res => {
      if (res)
        this.props.history.push(`/horario`);
      else
      {
        const valor = this.state.attempt -1;
        this.setState({attempt: valor, username: '', password: ''});
      }
    })
      .catch(err => {
        alert(err);
      });
  }

  render() {
    return (
      <div>
        <label >Usuario</label>
        <input
          autoComplete="off"
          name="username"
          type="text"
          onChange={this.onChange}
          value={this.state.username}
        ></input>
        <br />
        <label >Contraseña</label>
        <input
          autoComplete="off"
          name="password"
          type="password"
          id="password"

          onChange={this.onChange}
          value={this.state.password}
        ></input>
        <br />
        <label >Usuario tipo de</label>
        <input
          autoComplete="off"
          name="tipodesuario"
          type="text"
          id="tipousario"

          onChange={this.onChange}
          value={this.state.tipodesuario}
        ></input>
        <br />
        <div>

          <button onClick={this.onSubmit}>
            REGISTRAR
          </button>
        </div>
      </div>
    );
  }
}
export default Registro;
