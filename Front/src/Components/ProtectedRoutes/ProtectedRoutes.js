import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import Auth from '../auth';
const auth = new Auth();
//RUTA PROTEGIDA QUE VERIFICA QUE ESTAS LOGGEADO
const  ProtectedRoute = ({ ...props }) =>{
        if(auth.loggedIn())
                return <Route {...props}/> 
        else
                return <Redirect to="/login"/>
        }

export default ProtectedRoute;