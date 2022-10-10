import { useState, useEffect } from "react"
import { LinearProgress, TextField, Button } from "@mui/material"

import { crear2FA, eliminar2FA } from '../../services/auth'

import { toast } from 'react-toastify'

export default function Autenticacion() {

    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [token, setToken] = useState('')
    const [qr, setQr] = useState()

    useEffect(() => {
        const token = localStorage.getItem('token')
        setToken(token)
    }, [])



    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await crear2FA(token, password)
            setQr(response.data.qr)
            toast.success('Se ha creado el código QR, escanealo con tu aplicación de autenticación')
            setLoading(false)
        } catch (error) {
            toast.error(error.response.data.message || 'Error al crear 2FA')
            setLoading(false)
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await eliminar2FA(token)
            toast.success(response.data.message)
            setLoading(false)
        } catch (error) {
            toast.error(error.response.data.message || 'Error al eliminar 2FA')
            setLoading(false)
        }

    }


    return (
        <div>
            <h1 className="text-center text-3xl mb-4">Autenticación</h1>
            <div>
                <p>Usted tiene activada la autenticación de dos factores, para desactivarla, ingrese su contraseña y haga click en el botón "Desactivar autenticación de dos factores".</p>
                <p>Usted no tiene activada la autenticación de dos factores, para activarla, ingrese su contraseña y haga click en el botón "Activar autenticación de dos factores".</p>
            </div>

            <div>
                {qr && <img src={qr} alt="qr" />}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Contraseña"
                        type="password"
                        variant="outlined"
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                    >Activar autenticación de dos factores</Button>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleDelete}

                    >Desactivar autenticación de dos factores</Button>
                </form>

            </div>
        </div>
    )
}
