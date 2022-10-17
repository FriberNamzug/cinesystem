import { useState, useEffect } from "react"
import { LinearProgress, TextField, Button } from "@mui/material"

import { crear2FA, eliminar2FA } from '../../services/auth'
import { obtenerUsuario } from '../../services/usuarios'

import { toast } from 'react-toastify'

export default function Autenticacion() {

    const [loading, setLoading] = useState(false)
    const [usuario, setUsuario] = useState({})
    const [password, setPassword] = useState('')
    const [qr, setQr] = useState()
    const [token, setToken] = useState(window.localStorage.getItem('token'))
    const [flag, setFlag] = useState(false)

    useEffect(() => {
        const obtener = async () => {
            try {
                const { data } = await obtenerUsuario(token)
                setUsuario(data)
                console.log(data)
            } catch (error) {
                console.log(error)
            }
        }
        obtener()
    }, [flag])



    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        console.log(password)

        try {
            const response = await crear2FA(token, password)
            setQr(response.data.qr)
            toast.success('Se ha creado el código QR, escanealo con tu aplicación de autenticación')
            setLoading(false)
            setPassword('')
            setFlag(!flag)
        } catch (error) {
            toast.error(error.response.data.message || 'Error al crear 2FA')
            setLoading(false)
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault()
        setLoading(true)
        console.log(password)
        try {
            const response = await eliminar2FA(token, password)
            toast.success(response.data.message)
            setLoading(false)
            setPassword('')
            setFlag(!flag)
        } catch (error) {
            toast.error(error.response.data.message || 'Error al eliminar 2FA')
            setLoading(false)
        }

    }


    return (
        <div>
            <h1 className="text-center text-3xl mb-4">Autenticación</h1>
            <div>
                {usuario.twoFactor === 1 ? (
                    <p>Usted tiene activada la autenticación de dos factores, para desactivarla, ingrese su contraseña y haga click en el botón "Desactivar autenticación de dos factores".</p>) : (
                    <p>Usted no tiene activada la autenticación de dos factores, para activarla, ingrese su contraseña y haga click en el botón "Activar autenticación de dos factores".</p>)
                }
            </div>

            <div>
                {qr && <img src={qr} alt="qr" />}

                {usuario.twoFactor === 1 ? (
                    <form className='flex flex-col w-full' onSubmit={handleDelete}>
                        <TextField
                            label="Contraseña"
                            type="password"
                            disabled={loading}
                            value={password || ''}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            variant="outlined"
                            required
                        />
                        <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                        >Desactivar autenticación de dos factores</Button>
                    </form>
                ) : (
                    <form className='flex flex-col w-full' onSubmit={handleSubmit}>
                        <TextField
                            label="Contraseña"
                            type="password"
                            disabled={loading}
                            value={password || ''}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            variant="outlined"
                            required
                        />

                        <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                        >Activar autenticación de dos factores</Button>
                    </form>

                )}



            </div>
        </div>
    )
}
