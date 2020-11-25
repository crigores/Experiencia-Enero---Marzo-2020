import React from 'react';
//COMPONENTES
import NavButton from "./NavBarButton/navButton";
import DropDownButton from "./NavBarButton/dropDownButton";

const option = (role, saloncitos, url)=>{
      let result = [];
      let botones = [];
      switch (role) {

        case 1: //COORDINACION
          result.push(
            <ul  key={`Coordinador`} className="navbar-nav">

              <DropDownButton nombre="Pisos" array={saloncitos} link="pisos" />

              <NavButton
                key="Horarios"
                className="drawerNav"
                value={{
                  name: "Horarios",
                  direction: "/horarios"
                }}
              />


              <NavButton
                key="Chequeos"
                className="drawerNav"
                value={{
                  name: "Chequeos",
                  direction: "/chequeos"
                }}
              />

              <NavButton
                key="Ayuda"
                className="drawerNav"
                value={{
                  name: "Ayuda",
                  direction: "/ayuda"
                }}
              />
            </ul>
          );

          break;
        case 2: //MODULO
          result.push(
            <ul key={`Modulo`} className="navbar-nav">
              
              <DropDownButton nombre="Salones" array={saloncitos} link="salones" />
              
              <NavButton
                key="Horarios"
                className="drawerNav"
                value={{
                  name: "Horarios",
                  direction: "/horarios",
                  key:"horarios",
                }}
              />

              

              <NavButton
                key="Ayuda"
                className="drawerNav"
                value={{
                  name: "Ayuda",
                  direction: "/ayuda",
                  key:"ayuda",
                }}
              />
            </ul>
          );
          break;

        case 3: //GESTOR
          result.push(
            <ul key={`Gestor`} className="navbar-nav">
              
              <NavButton
                key="Gestor"
                className="drawerNav"
                value={{
                  name: "Gestor",
                  direction: "/gestor/" + url
                }}
              />

              <NavButton
                key="Horarios"
                className="drawerNav"
                value={{
                  name: "Horarios",
                  direction: "/horarios"
                }}
              />

              <NavButton
                key="Ayuda"
                className="drawerNav"
                value={{
                  name: "Ayuda",
                  direction: "/ayuda"
                }}
              />
            </ul>
          );
          break;
        default:
      }

      if (result.length > 0) {
          botones =  result.map((p, i) => {
            return p;
        });
      }

      return botones
};

export{option};