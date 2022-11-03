import { useState, useEffect } from 'react'
import Card from '../../components/Card'

import { Link } from "react-router-dom"


import { buscarPeliculas } from '../../services/peliculas'

import { obtenerGeneros } from '../../services/generos'

export default function Index() {
    const [generos, setGeneros] = useState([])

    useEffect(() => {
        const getGeneros = async () => {
            const response = await obtenerGeneros("1", "50")
            setGeneros(response.data.generos)
            console.log(response.data.generos)
        }
        getGeneros()
    }, [])


    return (
        <div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="col-span-1 md:col-span-9">
                    <div className="bg-slate-700 bg-opacity-60 rounded-b-xl">
                        <div className="flex flex-col justify-center items-center h-full">
                            <h2 className="text-4xl font-bold text-white">Bienvenido a la página principal</h2>
                            <h3 className='text-2xl font-bold text-white'>Te mostramos las peliculas globales del momento</h3>
                            <h4 className='text-2xl font-bold text-white'>Si quieres ver nuestra cartelera ve a funciones o da click
                                <Link to={"/funciones"} >
                                    <span className='text-blue-500'>
                                        {" Aqui"}
                                    </span>
                                </Link>
                            </h4>
                        </div>

                        <div className='flex flex-row flex-wrap justify-center'>
                            {
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
                                    return <Card key={index} />
                                })
                            }
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
