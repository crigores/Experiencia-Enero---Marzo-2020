import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect  } from "react-router-dom";

import Gestor from "./Views/Gestor/gestor";
import Login from "./Views/Login/login";
import Inicio from "./Views/Inicio/Inicio";
import Registro from "./Views/Registro/registro";
import ProtectedRoute from "./Components/ProtectedRoutes/ProtectedRoutes";
import NavBar from "./Components/NavBar/navBar";
import Salones from "./Views/Modulo/modulo";
import Ayuda from "./Views/Ayuda/ayuda";
import Horarios from "./Views/Horarios/horarios";
import Chequeos from "./Views/Chequeos/chequeos";
import Pisos from "./Views/Pisos/pisos";
import Auth from "./Components/auth";

//const initialState = {count: 0};

class MAGI extends Component {
  constructor(){
    super();
    this.auth = new Auth();
    this.loggedIn = this.loggedIn.bind(this);
  }
  
  
  loggedIn(){
    this.forceUpdate(); 
  }

  render() {
    return (

        <BrowserRouter>
        
             
            <Route exact path="/login" 
              render={(props) => <Login callback={this.loggedIn} {...props} isAuthed={true} />} />
            <ProtectedRoute path="/" component={NavBar} />
            <div id="CONTENEDOR" className="container">
                <Switch> 
                  <Route exact path="/registro" component={Registro} />
                  <ProtectedRoute exact path="/inicio" component={Inicio} />
                  <ProtectedRoute exact path="/salones/:salonID" component={Salones}/>
                  <ProtectedRoute path="/ayuda" component={Ayuda}/>
                  <ProtectedRoute path="/horarios" component={Horarios}/>
                  <ProtectedRoute path="/chequeos" component={Chequeos}/>
                  <ProtectedRoute exact path="/pisos/:pisoID" component={Pisos}/>
                  <ProtectedRoute exact path="/gestor/:salonID" component={Gestor} />
                  <ProtectedRoute path="*" component={() => { return <Redirect to="/inicio"/> }}/>
                </Switch>
            </div>
          
        </BrowserRouter>

    );
  }

  
}




export default MAGI;
