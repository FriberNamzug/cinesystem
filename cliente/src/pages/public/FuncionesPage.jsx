import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"

import Card from '../../components/Card'

import { obtenerPeliculasConDisponibilidad } from '../../services/peliculas'

import {
    TextField,
    Button,
    Box,
    Paper,
    CircularProgress,
} from '@mui/material'


export default function FuncionesPage() {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [peliculas, setPeliculas] = useState([])

    const url = import.meta.env.VITE_RUTA_API;

    useEffect(() => {
        const getPeliculas = async () => {
            const response = await obtenerPeliculasConDisponibilidad()
            setPeliculas(response.data.peliculas)
            console.log(response.data.peliculas)
            setLoading(true)
        }
        getPeliculas()
    }, [])


    return (
        <div>
            {!loading && (<div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
            )}

            {loading && (

                <div className='flex flex-row flex-wrap justify-center'>
                    {peliculas.map((pelicula) => (
                        <Card
                            key={pelicula.id_pelicula}
                            pelicula={pelicula}
                            botonTxt={"Ver funciones"}
                            botonUrl={pelicula.id_pelicula}
                            img={pelicula.imagen.default ? pelicula.imagen.url : url + pelicula.imagen.url}
                        />
                    ))}

                </div>
            )}




        </div>
    )
}

