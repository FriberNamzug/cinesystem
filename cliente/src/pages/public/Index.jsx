import { useState, useEffect } from 'react'
import Card from '../../components/Card'

import { Link } from "react-router-dom"


import { obtenerPeliculas } from '../../services/peliculas'

import {
    CircularProgress,
    Stack,
    Pagination
} from '@mui/material'

import { obtenerGeneros } from '../../services/generos'

const url = import.meta.env.VITE_RUTA_API;


export default function Index() {
    const [generos, setGeneros] = useState([])
    const [peliculas, setPeliculas] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(5);
    const [totalElementos, setTotalElementos] = useState(0);

    useEffect(() => {
        const getGeneros = async () => {
            try {
                const { data } = await obtenerGeneros("1", "50")
                setGeneros(data.generos)
            } catch (error) {
                console.log(error)
                setGeneros([])
            }
        }
        const getPeliculas = async () => {
            try {
                const { data } = await obtenerPeliculas(page, "10")
                setPeliculas(data.peliculas)
                setCount(data.totalPaginas);
                setTotalElementos(data.total);
                setLoading(false)
            } catch (error) {
                console.log(error)
                setPeliculas([])
            }
        }
        getGeneros()
        getPeliculas()

    }, [])

    const handlePagination = async (event, page) => {
        setLoading(true);
        try {
            const { data } = await obtenerPeliculas(page, 5);
            setCount(data.totalPaginas);
            setPage(data.pagina);
            setPeliculas(data.peliculas);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setPeliculas([]);
            toast.info(error.response.data.message)
        }
    }

    return (
        <div>

            {loading && (<div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="col-span-1 md:col-span-9">
                    <div className=" rounded-b-xl">
                        <div className="flex flex-col justify-center items-center h-full">
                        </div>

                        <div className='flex flex-col justify-center items-center'>

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


                            <div className='bg-white rounded-xl p-1 m-5 w-96 flex flex-row justify-center'>
                                <Stack spacing={1} alignItems={"center"}>

                                    <Pagination count={count} page={page} variant="outlined" shape="rounded" onChange={handlePagination} />
                                    <p className='text-xs'>Cantidad de peliculas: <b>{totalElementos}</b></p>
                                </Stack>
                            </div>
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
