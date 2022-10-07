import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';


import {
    TextField,
    Button,
    InputLabel,
    Input,
    InputAdornment,
    FormControl,
} from '@mui/material'

import ReplyIcon from '@mui/icons-material/Reply';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

import bgLogin from "../../assets/bg-login.jpg";

import { validar2FA } from '../../services/auth';

import { toast } from 'react-toastify';
import { IMaskInput } from 'react-imask';

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="0 - 0 - 0 - 0 - 0 - 0"
            definitions={{
                '#': /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    );
});



export default function Auth2FA() {
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const handleBack = () => navigate(-1);
    const token = localStorage.getItem('token')

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Solo tomamos los numeros
        setCode(value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await validar2FA(token, code);
            toast.success(response.data.message)
            localStorage.removeItem('token')
            window.localStorage.setItem("token", response.data.token);
            navigate('/dashboard')
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error(error.response.data.message || error.message)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                navigate('/login')
            }
            console.log(error)
        }
    }



    return (
        <div>
            <div>
                <img src={bgLogin} alt="bgLogin" style={{ width: "100%", height: "100%", position: "fixed", zIndex: "-1" }} />
                <div className="flex justify-center items-center h-screen">
                    <div className="w-96 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-2xl duration-500  sm:p-6 lg:p-8 ">
                        <div className="flex justify-end">
                            <Button onClick={handleBack} className="text-red-500 hover:text-red-700 duration-500">
                                <ReplyIcon />
                            </Button>
                        </div>
                        <div className="flex flex-col items-center">
                            <h1 className="text-2xl font-bold text-gray-700">Autenticacion en dos pasos</h1>
                        </div>
                        <div className="flex flex-col justify-center items-center mt-4">

                            <form onSubmit={handleSubmit} >
                                <div className="flex flex-row justify-center items-center mt-4">

                                    <FormControl variant="standard" margin='normal'>
                                        <InputLabel htmlFor="code">
                                            Codigo de autenticacion
                                        </InputLabel>
                                        <Input
                                            placeholder='X - X - X - X - X - X'
                                            type="text"
                                            name="code"
                                            value={code || ''}
                                            onChange={handleChange}
                                            id="code"
                                            inputComponent={TextMaskCustom}

                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <VpnKeyIcon />
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>

                                </div>

                                <Button
                                    variant="contained"
                                    color="success"
                                    type="submit"
                                    fullWidth
                                    disabled={loading}
                                >
                                    Verificar
                                </Button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>















        </div>
    )
}
