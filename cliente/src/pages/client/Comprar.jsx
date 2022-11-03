import { useState, useEffect, Fragment } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import {
    Button,
    Box,
    Paper,
    TextField,
    LinearProgress,
    FormControl,
    FormLabel,
    Typography,
    Divider,
    FormHelperText
} from '@mui/material'


import { toast } from 'react-toastify';

import { obtenerFuncion } from '../../services/funciones';
import { crearOrdenCompra } from '../../services/payments'


export default function Comprar() {
    const { id_funcion } = useParams()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [fecha, setFecha] = useState()
    const [error, setError] = useState({
        message: "",
        error: false
    })
    const [desactivado, setDesactivado] = useState(true)
    const navigate = useNavigate()
    const token = localStorage.getItem('token')


    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await obtenerFuncion(id_funcion)
                setData(data)
            } catch (error) {
                toast.error(error.message)
                navigate(-1)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleFecha = (e) => {
        //validamos que la fecha no sea menor al data.funcion.desde
        //Obtenemos la fecha de la funcion y la fecha seleccionada y la convertimos en date para poder compararlas
        const fechaFuncionDesde = new Date(data.funcion.desde)
        const fechaFuncionHasta = new Date(data.funcion.hasta)
        const fechaSeleccionada = new Date(e.target.value)
        //Si la fecha seleccionada es menor a la fecha de la funcion, mostramos un error
        if (fechaSeleccionada < fechaFuncionDesde) {
            setError({
                message: `No puede ser menor a ${fechaFuncionDesde.toLocaleDateString()}`,
                error: true
            })
        } else if (fechaSeleccionada > fechaFuncionHasta) {
            setError({
                message: `No puede ser mayor a ${fechaFuncionHasta.toLocaleDateString()}`,
                error: true
            })
        } else {
            setError({
                message: "",
                error: false
            })
            setFecha(e.target.value)
            setDesactivado(false)
        }
    }



    const handleComprar = async (e) => {
        if (error.error) return toast.error(error.message)
        if (!fecha) return toast.error("Debe seleccionar una fecha")
        const item = {
            id_funcion,
            fecha
        }
        try {
            setLoading(true)
            setDesactivado(true)
            const response = await crearOrdenCompra(token, item)
            console.log(response)
            window.location.href = response.data.order
        } catch (error) {
            setDesactivado(false)
            setLoading(false)
            console.log(error)
            toast.error(error.message)
        }
    }



    return (
        <Fragment>
            {loading && (<div className="w-full"><LinearProgress /></div>)}

            {!loading && (
                <div className="text-center m-5 w-full bg-slate-50 rounded-xl">
                    <div className="m-5">
                        <h1 className="text-3xl font-bold text-slate-900">Comprar para la pelicula {data.pelicula.titulo}</h1>
                    </div>


                    <div className='flex flex-row'>
                        <div className="flex flex-col w-full p-5">
                            <FormControl component="fieldset" margin="normal" fullWidth>
                                <FormLabel component="legend">Fecha de la funcion</FormLabel>
                                <TextField
                                    variant="outlined"
                                    value={fecha || ""}
                                    onChange={handleFecha}
                                    type="date"
                                />
                                {error.error && (
                                    <FormHelperText error>{error.message}</FormHelperText>
                                )}
                            </FormControl>

                            <FormControl component="fieldset" margin="normal">
                                <FormLabel component="legend">Hora de la funcion</FormLabel>
                                <TextField
                                    label="Hora"
                                    value={data.funcion.horario}
                                    disabled
                                    margin="normal"
                                />
                            </FormControl>
                            <FormControl component="fieldset" margin="normal">
                                <FormLabel component="legend">Sala de la funcion</FormLabel>
                                <TextField
                                    label="Sala"
                                    value={data.funcion.sala}
                                    disabled
                                    margin="normal"
                                />
                            </FormControl>
                            <FormControl component="fieldset" margin="normal">
                                <FormLabel component="legend">Costo del boleto</FormLabel>
                                <TextField
                                    label="Precio"
                                    value={data.funcion.costo_boleto}
                                    type="number"
                                    disabled
                                    margin="normal"
                                />
                            </FormControl>
                        </div>

                        <div className='flex flex-col w-full p-5'>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <Paper elevation={3} sx={{ p: 2, width: '100%', }}>
                                    <h1 className="text-2xl font-bold text-slate-900">Resumen de la compra</h1>


                                    <div>
                                        <div className="flex flex-row justify-between">
                                            <Typography variant="body1" component="div">
                                                1 Boleto para la pelicula:
                                            </Typography>
                                            <Typography variant="body1" component="div">
                                                {data.pelicula.titulo}
                                            </Typography>
                                        </div>

                                        <div className="flex flex-row justify-between">
                                            <Typography variant="body1" component="div">
                                                Fecha:
                                            </Typography>
                                            <Typography variant="body1" component="div">
                                                {fecha}
                                            </Typography>
                                        </div>

                                        <div className="flex flex-row justify-between">
                                            <Typography variant="body1" component="div">
                                                Hora:
                                            </Typography>
                                            <Typography variant="body1" component="div">
                                                {data.funcion.horario}
                                            </Typography>
                                        </div>

                                        <div className="flex flex-row justify-between">
                                            <Typography variant="body1" component="div">
                                                Sala:
                                            </Typography>
                                            <Typography variant="body1" component="div">
                                                {data.funcion.sala}
                                            </Typography>
                                        </div>

                                        <div className="flex flex-row justify-between">
                                            <Typography variant="body1" component="div">
                                                Costo del boleto:
                                            </Typography>
                                            <Typography variant="body1" component="div">
                                                ${data.funcion.costo_boleto}
                                            </Typography>
                                        </div>
                                    </div>
                                    <Divider sx={{ my: 2 }} />
                                    <div className="flex flex-row justify-between">
                                        <Typography variant="body1" component="div">
                                            Total:
                                        </Typography>
                                        <Typography variant="body1" component="div">
                                            ${data.funcion.costo_boleto}
                                        </Typography>
                                    </div>

                                    <Divider sx={{ my: 2 }} />

                                    <div className="flex flex-row justify-between">
                                        <Button variant="contained" color="error" onClick={() => navigate(-1)}>
                                            Volver
                                        </Button>
                                        <Button variant="contained" color="success" onClick={handleComprar} disabled={desactivado}>
                                            Comprar
                                        </Button>
                                    </div>
                                </Paper>
                            </Box>
                            <div className="flex flex-col justify-between">
                                <Typography variant="body1" component="div">
                                    Al dar click en comprar, se te redireccionara a la pagina de paypal para realizar el pago.
                                    Una vez realizado el pago, se te enviara un correo electronico con la informacion de la compra.
                                </Typography>
                            </div>
                        </div>



                    </div>
                </div>


            )
            }
        </Fragment >
    )
}
