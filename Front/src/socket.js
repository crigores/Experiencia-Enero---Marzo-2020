import socketIOClient from "socket.io-client";
import {URL_BACKEND} from "./variables-entorno"


const socket = socketIOClient(URL_BACKEND);



export default socket;