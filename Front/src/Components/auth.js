import decode from "jwt-decode";
import {URL_BACKEND} from '../variables-entorno';

export default class Auth {
  // Initializing important variables

  login = ({ username, password }) => {
    // Get a token from api server using the fetch api
    return this.fetch(`${URL_BACKEND}users/login`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      })
    }).then(res => {
      this.setToken(res.token); // Setting the token in localStorage
      console.log(res);
      return Promise.resolve(res);
    });
  };

  socketValidation = (ID,rolcito)=>{
    return this.fetch(`${URL_BACKEND}users/socketvalidation`, {
      method: "POST",
      body: JSON.stringify({
        socketID: ID,
        role: rolcito,
      })
    });
  };

  loggedIn = () => {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken(); // Getting token from localstorage
    return this.isTokenExpired(token); // handwaiving here
  };

  isTokenExpired = token => {
    try {
      const decoded = decode(token);
      /**
       *  @TODO
       * ESTABAMOS HACIENDO LOS DIFERENTES ROLES,
       * ESTABAMOS PASANDO A TRAVES DE LOS JWT LOS ROLES DESCUBRIMOS QUE
       * EFECTIVAMENTE SI PUEDES PASAR EL USUARIO
       */
      if (decoded.exp - Date.now() / 1000 > 0)
        // Checking if token is expired.
        return true;
      else return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  setToken = idToken => {
    // Saves user token to localStorage
    localStorage.setItem("id_token", idToken);
  };

  getToken = () => {
    // Retrieves the user token from localStorage
    return localStorage.getItem("id_token");
  };

  logout = () => {
    // Clear user token and profile data from localStorage
    localStorage.removeItem("id_token");
  };

  getConfirm = () => {
    // Using jwt-decode npm package to decode the token
    let answer = decode(this.getToken());
    return answer;
  };

  fetch = (url, options) => {
    // performs api calls sending the required authentication headers
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (this.loggedIn()) {
      headers["Authorization"] = "Bearer " + this.getToken();
    }

    return fetch(url, {
      headers,
      ...options
    })
      .then(this._checkStatus)
      .then(response => response.json());
  };

  register = ({ username, password, typeUser }) => {
    return this.fetch(`${URL_BACKEND}users/registro`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
        typeUser
      })
    }).then(response => {
      console.log("Registered");
    });
  };

  _checkStatus = response => {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      // Success status lies between 200 to 300
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  };
  refresh() {

    const token = this.getToken();
    return this.fetch(`${URL_BACKEND}users/refreshToken`, {
      method: "POST",
      body: JSON.stringify({token})
    }).then(response => {
      this.logout();
      localStorage.setItem("id_token", response.newToken);
    });
  }

  getTokenValue() {
    return this.getConfirm().valor;
  }
}

/*
axios.create({
  baseURL: URL_BACKEND,
  responseType: "JSON"
});
export const register = user => {
  return axios
    .post('users/registro', {
      username: user.username,
      password: user.password,
      typeUser: user.typeUser,
    })
    .then(response => {
      console.log('Registered')
    });
}

export const login = user => {
  return axios
    .post('users/login', {
      username: user.username,
      password: user.password
    })
    .then(response => {
      localStorage.setItem('usertoken', response.data)
      return response.data
    })
    .catch(err => {
      console.log(err)
    });


}*/
