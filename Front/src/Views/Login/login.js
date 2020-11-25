import React,{Component} from 'react';
import style from './login.module.css';
import Auth from '../../Components/auth';

class Login extends Component {
  constructor(props){
    super();
    this.state ={
      attempt: 3,
      username: '',
      password:'',
      callback: props.callback,
    };
    this.auth = new Auth();
    //this.validate = this.validate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

  }

  onChange(e){
    //@TODO VALIDAR EN EL BACK
    this.setState({ [e.target.name]: e.target.value });
  }


  onSubmit(e){
    
    //SOME VALIDATION
    e.preventDefault();

    const user = {
      username: this.state.username,
      password: this.state.password,
    }

    
    this.auth.login(user).then(res => {
      if (res === false) {
          return alert("Sorry those credentials don't exist!");
      }
      this.state.callback();
      // this.props.history.replace('/inicio');
      // window.location.reload(false);
      
      
  })
  .catch(err => {
      alert(err);
  })
 
  }


  render(){
    return(
      <form onSubmit={this.onSubmit} className={style.General}>
         <div className={style.contenedorIzquierdo}>
          <div className={style.frame}>
            <img src="/MAGI-logo.svg" alt="logo" className={style.img} />
          </div>
         </div>
        
         
          <div className={style.login}>
            <div className={style.contenedorDerecho}>
              <div className={style.Datos}>
    
                <div className={style.Usuario}>
                  <label className={style.etiqueta} >Usuario</label>
                </div>
                <input autoFocus autoComplete="off" name="username" type="text"  className={style.input} onChange={this.onChange} value={this.state.username} disabled={this.state.attempt < 1}></input>
    
                <div className={style.Contraseña}>
                  <label className={style.etiqueta}>Contraseña</label>
                </div>
                <input autoComplete="off" name= 'password' type="password" id="password" className={style.input} onChange={this.onChange} value={this.state.password} disabled={this.state.attempt < 1}></input>
              </div>
              
              <div>
                <button className={style.btn} type="submit" onClick={this.onSubmit} disabled={this.state.attempt < 1}>Ingresar</button>					
              </div>
            </div>
          </div>
        
      </form>
    );

  }
}
export default Login;