import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"

import Card from '../../components/Card'

import { obtenerPeliculasConDisponibilidad } from '../../services/peliculas'

import {
    CircularProgress,
    Stack,
    Pagination
} from '@mui/material'

import { toast } from 'react-toastify'


export default function FuncionesPage() {

    const [loading, setLoading] = useState(true)
    const [peliculas, setPeliculas] = useState([])
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(5);
    const [totalElementos, setTotalElementos] = useState(0);




    const url = import.meta.env.VITE_RUTA_API;

    useEffect(() => {
        const getPeliculas = async () => {
            try {
                const { data } = await obtenerPeliculasConDisponibilidad(1, 5)
                setPeliculas(data.peliculas)
                setCount(data.totalPaginas);
                setTotalElementos(data.total);
                setLoading(false)
            } catch (error) {
                console.log(error)
                setPeliculas([])
                toast.info(error.response.data.message)
                setLoading(false)
            }
        }
        getPeliculas()
    }, [])


    const handlePagination = async (event, page) => {
        setLoading(true);
        try {
            const { data } = await obtenerPeliculasConDisponibilidad(page, 5);
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

            {!loading && (

                <div className='flex flex-col justify-center items-center'>
                    <div className='flex flex-row flex-wrap'>
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

                    <div className='bg-white rounded-xl p-1 w-96 flex flex-row justify-center'>
                        <Stack spacing={1} alignItems={"center"}>

                            <Pagination count={count} page={page} variant="outlined" shape="rounded" onChange={handlePagination} />
                            <p className='text-xs'>Cantidad de peliculas: <b>{totalElementos}</b></p>
                        </Stack>
                    </div>
                </div>



            )}





        </div>
    )
}

