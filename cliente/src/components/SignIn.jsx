import React, { useState, useRef, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { login } from '../services/auth.js'
import AccountCircle from "@mui/icons-material/AccountCircle";
import PasswordIcon from "@mui/icons-material/Password";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import {
    LinearProgress,
    TextField,
    Button,
    InputAdornment,
    FormControl,
    InputLabel,
    OutlinedInput,
    IconButton,
} from "@mui/material";

import { toast } from 'react-toastify'
export default function SignIn() {


    const [dataUsuario, setDataUsuario] = useState({
        email: "",
        password: "",
        showPassword: false,
    });
    const [loading, setLoading] = useState(false);



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
                    </FormControl>
                </div>

                {/* <HCaptcha
                    ref={captchaRef}
                    sitekey={KEY_CAPTCHA}
                    onVerify={(token, ekey) => setToken(token)}
                    onExpire={(e) => setToken("")}
                    onError={(e) => console.log(e)}
                /> */}

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
        </Fragment>
    )
}
