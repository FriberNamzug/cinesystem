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

    useEffect(() => {
        const getPeliculas = async () => {
            const response = await obtenerPeliculasConDisponibilidad("1", "50")
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

                <Paper sx={{ p: 2, margin: 'auto', maxWidth: 500, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {peliculas.map((pelicula) => (
                            <Card
                                key={pelicula.id_pelicula}
                                pelicula={pelicula}
                                botonTxt={"Ver funciones"}
                                botonUrl={pelicula.id_pelicula}
                            />
                        ))}
                    </Box>
                </Paper>

            )}




        </div>
    )
}

