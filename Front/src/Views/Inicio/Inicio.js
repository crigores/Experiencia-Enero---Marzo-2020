import React,{Component} from 'react';
import Auth from "../../Components/auth";
import style from './Inicio.module.css';

import bd from './img/bd.jpg';





class Inicio extends Component{
	constructor() {
		super();
		this.auth = new Auth();
	}
    componentDidMount(){
    }

    render(){
        return(
            <div className={style.contenedor}>
                <header className={style.header}>
                        <div className={style.title}>
                               <h1>Bienvenido</h1>
                        <h2>Estas son las ultimas Tendencias </h2>  
                        </div>
                       
                </header>


                <div className={style.noticias}>
                    
                    <div className={style.articulo} id={style.img1}>
                            <div className={style.descricion}>
                                    <p>Como parte de las actividades que organiza la Universidad Privada Dr. Rafael Belloso Chacín para el cierre de período académico septiembre-diciembre 2019, desde el Salón de Usos Múltiples, la Direcció...</p>
                            </div>
                    </div>
                    <div className={style.articulo} id={style.img2}>
                            <div className={style.descricion}>
                                    <p>
										Como ya es tradición, cada 21 de noviembre, la Universidad Privada Dr. Rafael Belloso Chacín, homenajea a sus alumnos más destacados con motivo de la celebración por el Día del Estudiante Universitari..
									</p>
                            </div>
                    </div>
                    <div className={style.articulo} id={style.img3}>
                            <div className={style.descricion}>
                                    <p>
										Ciencias Jurídicas y Políticas, Ingeniería, junto a Ciencias de la Informática, tres de las Facultades pertenecientes a la Universidad Privada Dr. Rafael Belloso Chacín, realizaron por primera vez, un...
									</p>
                            </div>
                    </div>
                    <div className={style.articulo} id={style.img4}>
                            <div className={style.descricion}>
                                    <p>
										Ciencias Jurídicas y Políticas, Ingeniería, junto a Ciencias de la Informática, tres de las Facultades pertenecientes a la Universidad Privada Dr. Rafael Belloso Chacín, realizaron por primera vez, un...
									</p>
                            </div>
                    </div>
                    <div className={style.articulo} id={style.img5}>
                            <div className={style.descricion}>
                                    <p>
										Como parte de las actividades que organiza el Decanato de Investigación y Postgrado de la Universidad Privada Dr. Rafael Belloso Chacín para ofrecer a sus participantes una mayor formación en cuanto a...
									</p>
                            </div>
                    </div>
                    <div className={style.articulo} id={style.img6}>
                            <div className={style.descricion}>
                                    <p>
										It is a long established fact that a reader will be distracted by the readable content of a page when looking
									</p>
                            </div>
                    </div>
                </div>

                <div className={style.parallax}>
                        <div className={style.divisor}>

                        </div>
                </div>

                <div className={style.cumpleanos}>
                        <h1>Cumpleaños del mes</h1>
                        <img src={bd} alt=""/>
                </div>
            </div>
        );

    }
}
export default Inicio;