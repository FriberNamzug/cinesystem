import React, { useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"


import {
    TextField,
    Button,
} from '@mui/material'

import bgLogin from "../../assets/bg-login.jpg";

import { cambiarPasswordConToken } from '../../services/auth';
import { toast } from 'react-toastify';




export default function RecuperarPassword() {

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        password: "",
        password2: "",
    })
    const { token } = useParams()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const validarContraseña = () => {
        if (data.password !== data.password2) {
            toast.error("Las contraseñas no coinciden")
            return false
        } else if (data.password.length < 8) {
            toast.error("La contraseña debe tener al menos 8 caracteres")
            return false
        } else if (!data.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            toast.error("La contraseña debe tener al menos una mayuscula, una minuscula, un numero y un caracter especial")
            return false
        } else if (data.password.match(/([0-9])\1{2,}/) || data.password.match(/([a-zA-Z])\1{2,}/)) {
            toast.error("La contraseña no debe de tener 3 numeros o letras consecutivas")
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarContraseña()) return
        setLoading(true);
        try {
            const response = await cambiarPasswordConToken(token, data.password);
            console.log(response);
            toast.success("Contraseña cambiada correctamente");
            navigate("/login");
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message || error.message, { autoClose: 8000 });
            toast.info("Cerrando ventana en 8 segundos", { autoClose: 8000 });
            setTimeout(() => {
                window.close();
            }, 8000);

        }
        setLoading(false);
    }



    return (
        <div>
            <div>
                <img src={bgLogin} alt="bgLogin" style={{ width: "100%", height: "100%", position: "fixed", zIndex: "-1" }} />
                <div className="flex justify-center items-center h-screen">
                    <div className="w-96 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-2xl duration-500  sm:p-6 lg:p-8 ">
                        <div className="flex flex-col items-center">
                            <h1 className="text-2xl font-bold text-gray-700">Cambiar contraseña</h1>
                        </div>
                        <div className="flex flex-col justify-center items-center mt-4">

                            <form onSubmit={handleSubmit} >

                                <TextField
                                    label="Contraseña"
                                    variant="standard"
                                    size="medium"
                                    fullWidth
                                    type="password"
                                    name="password"
                                    required
                                    value={data.password || ""}
                                    onChange={handleChange}
                                    margin="normal"
                                />

                                <TextField
                                    label="Confirmar contraseña"
                                    variant="standard"
                                    size="medium"
                                    fullWidth
                                    type="password"
                                    name="password2"
                                    required
                                    value={data.password2 || ""}
                                    onChange={handleChange}
                                    margin="normal"
                                />


                                <div className="flex justify-center items-center mt-4">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        type="submit"
                                        fullWidth
                                        disable={loading}
                                    >
                                        Cambiar Contraseña
                                    </Button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
