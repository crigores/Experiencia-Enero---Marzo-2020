console.clear();

//? VARIABLES PARA INICIAR LOS PROTOCOLOS QUE UTILIZARA EL SERVIDOR (HTTP y WebSockets)
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

//?INSTANCIAS DE FUNCIONES RELACIONADAS CON CADA UNO DE LOS TIPOS DE CLIENTES
const GESTOR = require('./Clients/GESTOR.js');
const MODULO = require('./Clients/MODULO.js');
const CLIENTE = require('./Clients/CLIENTE.js');
const COORDINACION = require('./Clients/COORDINACION.js');


const Users = require('./routes/user'); //RUTA HACIA TODOS LAS ACCIONES RELACIONADAS CON USUARIOS
const {LlenarLista} = require('./Reservaciones-bdd.js'); //FUNCIONES RELACIONADAS CON LA BDD
const PORT = 2488;  //PUERTO EN DONDE ESCUCHA EL SERVIDOR


LlenarLista().then(resultado => {

  //?RUTAS RELACIONADAS CON LOS USUARIOS DE LA PAGINA
  app.use('/users', Users);


  //?SABER SI UN USUARIO SE HA CONECTADO POR PRIMERA VEZ
  io.on('connect', (socket) => {

    ////////////////////////////////////////////////////////////////////////////////
    //?REGISTRA MODULO EN EL ARREGLO DE MODULOS
    MODULO.OnConnect(socket, io);
    
    ////////////////////////////////////////////////////////////////////////////////
    //?REGISTRA GESTORES EN EL ARREGLO DE MODULOS
    GESTOR.OnConnect(socket, io);

    ////////////////////////////////////////////////////////////////////////////////
    //?REGISTRA CLIENTES EN EL ARREGLO DE MODULOS
    CLIENTE.OnConnect(socket,io);

  });
 

  //?FUNCIONES CON USUARIOS YA CONECTADOS
  io.on('connection', socket =>{


    ////////////////////////////////////////////////////////////////////////////////
    //?ACTUALIZA LA PAGINA DE GESTOR EN ESPECIFICO
    GESTOR.OnGestor_salon(socket,io);

    ////////////////////////////////////////////////////////////////////////////////
    //?ACTUALIZA LA PAGINA DEL MODULO EN ESPECIFICO
    MODULO.OnModulo_salon(socket,io);

    ////////////////////////////////////////////////////////////////////////////////
    //?MODULO ENVIA CEDULA DESDE EL LA PAGINA VERIFICA SI NO ESTA REPETIDA Y ASIGNA MAQUINA
    CLIENTE.onVerificarCedula(socket, io);
    

    ////////////////////////////////////////////////////////////////////////////////
    //?ACCIONES DE LOS MODALES DE MODULO O GESTOR HACIA CLIENTES EN ESPECIFICO
    CLIENTE.OnAction(socket,io);

    ////////////////////////////////////////////////////////////////////////////////
    //?ACCIONES DE LOS MODALES DE MODULO O GESTOR HACIA CLIENTES GLOBALES
    CLIENTE.OnActionGlobal(socket,io);

    ////////////////////////////////////////////////////////////////////////////////
    //?HABILITA UN SALON DESDE RECTORADO
    COORDINACION.OnCoordinacion_CambioStatus(socket,io);

    ////////////////////////////////////////////////////////////////////////////////
    //?MUESTRA GRID EN PAGINA DE COORDINACION EN FUNCION A LOS PISOS
    COORDINACION.ShowCoordinacion(socket,io);

    ////////////////////////////////////////////////////////////////////////////////
    //?ENCIENDE GESTOR EN SALON ESPECIFICO
    COORDINACION.EncenderGestor(socket, io);

    ////////////////////////////////////////////////////////////////////////////////
    //?MUESTRA MENSAJES A LOS DIFERENTES MODULOS 
    MODULO.OnModulo_msj(socket,io);

    ////////////////////////////////////////////////////////////////////////////////
    //?EMITE CAMBIOS DE STATUS DE PC YA CONECTADAS
    CLIENTE.ClienteStatus(socket, io);

    ////////////////////////////////////////////////////////////////////////////////
    //?DESCONECTA EL CLIENTE Y LO BORRA DE LA LISTA DE ACTIVOS  
    socket.on('disconnect',() =>{
      CLIENTE.OnDisconnect(socket, io);
      GESTOR.OnDisconnect(socket, io);
      MODULO.OnDisconnect(socket,io);
      COORDINACION.OnDisconnect(socket);
    });

  });

});

////////////////////////////////////////////////////////////////////////////////
//? EL SERVIDOR ESCUCHA EN EL PUERTO
http.listen(PORT, () => {
  console.log(`ESCUCHANDO EN EL PUERTO: ${PORT}`);
});
