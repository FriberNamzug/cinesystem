import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"

import {
    Chip,
    CircularProgress,
} from '@mui/material'

import { obtenerGeneros } from '../../services/generos'

import { toast } from 'react-toastify';


export default function GenerosPage() {

    const [loading, setLoading] = useState(false)
    const [generos, setGeneros] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const getGeneros = async () => {
            try {
                const response = await obtenerGeneros("1", "100")
                console.log(response.data)
                setGeneros(response.data)
                setLoading(true)
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }
        getGeneros()
    }, [])

    const handleClick = (id) => {
        navigate(`/generos/${id}`)
    }


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
                                <h2 className="text-4xl font-bold text-white">Todos los generos que tenemos!</h2>
                            </div>

                            <div className='flex flex-row mt-20 flex-wrap justify-center'>
                                {
                                    generos.generos.map((item) => {
                                        return (
                                            <div className='m-2 cursor-default' key={item.id_genero}>
                                                <Chip size='medium' color="info" label={item.nombre} onClick={() => handleClick(item.id_genero)} />
                                            </div>
                                        )
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



