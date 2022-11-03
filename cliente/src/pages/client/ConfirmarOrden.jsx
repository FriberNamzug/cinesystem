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

import { confirmarOrdenCompra } from '../../services/payments'
import { toast } from 'react-toastify'


export default function ConfirmarOrder() {
    const navigate = useNavigate()
    const { id_folio } = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState({
        error: false,
        message: ''
    })
    const [orden, setOrden] = useState()


    useEffect(() => {
        const validarCompra = async () => {
            const urlParams = new URLSearchParams(window.location.search)
            const token = urlParams.get('token')
            const PayerID = urlParams.get('PayerID')

            try {
                const response = await confirmarOrdenCompra(token, PayerID, id_folio)
                if (response.status === 200) {
                    setOrden(response.data)
                    console.log(response.data)
                    setLoading(false)
                } else {
                    setError({
                        error: true,
                        message: response.data.message
                    })
                }
            } catch (error) {
                toast.error(error.response.data.message)
                navigate('/')
            }
        }

        validarCompra()

    }, [])


    return (
        <Fragment>
            {loading && (<div className="w-full"><LinearProgress /></div>)}

            {!loading && (
                <>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Gracias por su compra
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Su orden ha sido procesada con éxito. En breve recibirá un correo electrónico con los detalles de su compra.
                    </Typography>

                    {/* Informacion de su pedido */}
                    <div className='flex flex-row'>
                        <div className='w-full'>
                            <Typography variant="h5" component="h2" gutterBottom>
                                Información de su pedido
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Orden:</strong> 123456789
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Fecha:</strong> 2021-10-10
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Función:</strong> 123456789
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Película:</strong> 123456789
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Asientos:</strong> 123456789
                            </Typography>
                        </div>
                        <div className='w-full'>
                            <Typography variant="h5" component="h2" gutterBottom>
                                Información de su pago
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Orden:</strong> 123456789
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Fecha:</strong> 2021-10-10
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Función:</strong> 123456789
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Película:</strong> 123456789
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Asientos:</strong> 123456789
                            </Typography>
                        </div>
                    </div>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h5" component="h2" gutterBottom>
                        ¿Qué hacer ahora?
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>1.</strong> Puede ver su compra en el historial o en sus boletos activos.
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>2.</strong> Puede imprimir su boleto, al igual que descargarlo y mostrarlo en la entrada del cine.
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ mt: 2, mr: 1 }}>
                            Imprimir Boleto
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ mt: 2, ml: 1 }}
                            onClick={() => navigate('/')}>
                            Regresar
                        </Button>
                    </Box>
                </>)}

        </Fragment>
    )
}
