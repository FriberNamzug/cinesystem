import React, { useState, useRef, Fragment } from "react";
import { useNavigate } from "react-router-dom";

import { login, recuperarPassword } from '../../services/auth.js'

import AccountCircle from "@mui/icons-material/AccountCircle";
import PasswordIcon from "@mui/icons-material/Password";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Close from "@mui/icons-material/Close";


import {
    LinearProgress,
    TextField,
    Button,
    InputAdornment,
    FormControl,
    InputLabel,
    OutlinedInput,
    IconButton,
    FormHelperText,
    Modal,
} from "@mui/material";

import { toast } from 'react-toastify'

export default function SignIn() {


    const [dataUsuario, setDataUsuario] = useState({
        email: "",
        password: "",
        showPassword: false,
        olvidePassword: false,
    });
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setDataUsuario({ ...dataUsuario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await login(dataUsuario.email, dataUsuario.password);
            console.log(response.data);
            window.localStorage.setItem("token", response.data.token);
            if (response.data.twofa === true) {
                toast.success("Verifica tu aplicacion de autenticacion");
                navigate("/2fa");
            } else {
                toast.success("Bienvenido");
                navigate("/dashboard");
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response.status === 401) {
                setDataUsuario({
                    ...dataUsuario,
                    password: "",
                    olvidePassword: true,
                });
            }
            toast.error(error.response.data.message || error.message);

        }
    };

    const handleClickShowPassword = () => {
        setDataUsuario({
            ...dataUsuario,
            showPassword: !dataUsuario.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Fragment>
            <form onSubmit={handleSubmit}>
                <div className="m-1">
                    <TextField
                        label="Email"
                        type="email"
                        name="email"
                        onChange={handleChange}
                        value={dataUsuario.email || ""}
                        size="medium"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        autoComplete="email"
                        autoFocus
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>

                <div className="m-1">
                    <FormControl variant="outlined" margin="normal" className="w-full">
                        <InputLabel htmlFor="outlined-adornment-password">
                            Contraseña
                        </InputLabel>
                        <OutlinedInput
                            label="Contraseña"
                            type={dataUsuario.showPassword ? "text" : "password"}
                            name="password"
                            size="medium"
                            onChange={handleChange}
                            value={dataUsuario.password || ""}
                            fullWidth
                            required
                            startAdornment={
                                <InputAdornment position="start">
                                    <PasswordIcon />
                                </InputAdornment>
                            }
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {dataUsuario.showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        {dataUsuario.olvidePassword &&
                            <FormHelperText>
                                <span>¿Olvidaste tu contraseña?</span>
                                <Button onClick={handleOpen} color="warning">
                                    Recuperar
                                </Button>
                            </FormHelperText>
                        }
                    </FormControl>
                </div>


                <div className="m-2">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={loading}
                        fullWidth>
                        Iniciar Sesión
                    </Button>
                </div>

                {loading && <LinearProgress />}
            </form>
            <Modal open={open}>
                <div>
                    <RecordarPassword handleOpen={handleOpen} email={dataUsuario.email} setResetForm={setDataUsuario} />
                </div>
            </Modal>
        </Fragment>
    )
}


const RecordarPassword = ({ handleOpen, email, setResetForm }) => {

    const [mail, setMail] = useState(email || "");
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => setMail(e.target.value);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await recuperarPassword(mail);
            toast.success(response.data.message);
            handleOpen();
            setResetForm({
                email: "",
                password: ""
            })
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message || error.message);
            setLoading(false);
        }
    };


    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
        }} className="bg-white border rounded-xl ">
            <div className="flex justify-end">
                <Button onClick={handleOpen} className="text-red-500 hover:text-red-700 duration-500">
                    <Close />
                </Button>
            </div>

            <h1 className="text-2xl font-bold text-center">¿Olvidaste tu contraseña?</h1>
            <div className='p-5'>
                <p className="text-center underline">Verifica que tu correo electronico este correcto</p>
                <p className="text-center">Te enviaremos un enlace para que puedas recuperar tu contraseña</p>

                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <TextField
                            fullWidth
                            type="email"
                            label="Correo electrónico"
                            variant="outlined"
                            size="small"
                            value={mail || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-center items-center mt-4">
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loading}
                            fullWidth
                        >
                            Enviar
                        </Button>
                    </div>
                    {loading && <LinearProgress />}
                </form>
            </div>
        </div>

    )
}
