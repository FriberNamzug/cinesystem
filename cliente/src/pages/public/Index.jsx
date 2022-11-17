import { useState, useEffect } from 'react'
import Card from '../../components/Card'

import { Link } from "react-router-dom"


import { buscarPeliculas, obtenerPeliculas } from '../../services/peliculas'

import { obtenerGeneros } from '../../services/generos'

const url = import.meta.env.VITE_RUTA_API;


export default function Index() {
    const [generos, setGeneros] = useState([])
    const [peliculas, setPeliculas] = useState([])

    useEffect(() => {
        const getGeneros = async () => {
            const response = await obtenerGeneros("1", "50")
            setGeneros(response.data.generos)
            console.log(response.data.generos)
        }
        const getPeliculas = async () => {
            const response = await obtenerPeliculas("1", "50")
            setPeliculas(response.data.peliculas)
            console.log(response.data.peliculas)
        }

        getGeneros()
        getPeliculas()
    }, [])


    return (
        <div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="col-span-1 md:col-span-9">
                    <div className="bg-slate-700 bg-opacity-60 rounded-b-xl">
                        <div className="flex flex-col justify-center items-center h-full">
                        </div>

                        <div className='flex flex-row flex-wrap justify-center'>
                            {peliculas.map((pelicula) => (
                                <Card
                                    key={pelicula.id_pelicula}
                                    pelicula={pelicula}
                                    botonTxt={"Ver mas"}
                                    img={pelicula.imagen.default ? pelicula.imagen.url : url + pelicula.imagen.url}
                                />
                            ))}
                        </div>



                    </div>
                </div>

                <div className="col-span-1 md:col-span-3 ">
                    <div className="bg-slate-700 bg-opacity-60 h-screen rounded-b-xl w-full">
                        <div className="flex flex-col items-center h-full">
                            <h2 className="text-4xl font-bold text-white">Generos</h2>

                            {
                                generos.map((genero, index) => {
                                    return (
                                        <div key={index} className="flex flex-row justify-center items-center">
                                            <Link to={`/generos/${genero.id_genero}`}>
                                                <h3 className='text-2xl font-bold text-white hover:text-gray-400 duration-500'>{genero.nombre}</h3>
                                            </Link>
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div>
                </div>

            </div>

        </div>

    )
}
