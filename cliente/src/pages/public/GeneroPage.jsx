import { useState, useEffect } from 'react'

import { useNavigate, useParams } from "react-router-dom"
import {
    TextField,
    Button,
    CircularProgress,
} from '@mui/material'

import Card from '../../components/Card'

import { obtenerPeliculasPorGenero } from '../../services/peliculas'

import { toast } from 'react-toastify';


export default function GeneroPage() {

    const { id_genero } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [peliculas, setPeliculas] = useState([])

    const url = import.meta.env.VITE_RUTA_API;


    useEffect(() => {
        const getPeliculas = async () => {
            try {
                const response = await obtenerPeliculasPorGenero(id_genero)
                console.log(response.data)
                setPeliculas(response.data)
                setLoading(true)
            } catch (error) {
                toast.error(error.response.data.message)
                navigate('/generos')
            }
        }
        getPeliculas()
    }, [])


    return (
        <div>

            {!loading && (
                <div className="flex justify-center items-center h-screen">
                    <CircularProgress />
                </div>
            )}

            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="col-span-1 md:col-span-12">
                        <div>
                            <div className="flex flex-col justify-center items-center h-full">
                                <h2 className="text-4xl font-bold text-white">Genero: {peliculas.genero}</h2>
                            </div>

                            <div className='flex flex-row flex-wrap justify-center'>
                                {
                                    peliculas.peliculas.map((item, index) => {
                                        return <Card
                                            key={index}
                                            pelicula={item}
                                            botonTxt={"Ver mas"}
                                            img={item.imagen.default ? item.imagen.url : url + item.imagen.url}
                                        />
                                    })
                                }
                            </div>
                        </div>


                    </div>
                </div>
            )}












        </div>
    )
}



