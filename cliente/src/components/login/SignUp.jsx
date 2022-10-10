import { useState, Fragment } from "react";

import { useNavigate } from "react-router-dom";

import { register } from '../../services/auth.js'

import AccountCircle from "@mui/icons-material/AccountCircle";
import PasswordIcon from "@mui/icons-material/Password";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import BadgeIcon from '@mui/icons-material/Badge';

import {
    LinearProgress,
    TextField,
    Button,
    InputAdornment,
    FormControl,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    IconButton,
} from "@mui/material";

import { toast } from 'react-toastify'

import { validarNuevoRegistro, error as err } from '../../validations/login'


export default function SignUp({ close = null }) {


    const [dataUsuario, setDataUsuario] = useState({
        nombre: "",
        email: "",
        password: "",
        showPassword: false,
    });
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(err);




    const handleChange = (e) => {
        setDataUsuario({ ...dataUsuario, [e.target.name]: e.target.value });
        setError({ ...error, [e.target.name]: validarNuevoRegistro(e) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (error.nombre.error || error.email.error || error.password.error) return toast.error('Soluciona los errores en el formulario');
        setLoading(true);
        try {
            const response = await register(dataUsuario.nombre, dataUsuario.email, dataUsuario.password);
            console.log(response);
            toast.info(response.data.message, { autoClose: 10000 });
            close();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
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
                        helperText={error.email.message}
                        error={error.email.error}
                        disabled={loading}
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
                    <TextField
                        label="Nombre"
                        type="text"
                        name="nombre"
                        helperText={error.nombre.message}
                        error={error.nombre.error}
                        disabled={loading}
                        onChange={handleChange}
                        size="medium"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <BadgeIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>

                <div className="m-1">
                    <FormControl
                        variant="outlined"
                        margin="normal"
                        required
                        disabled={loading}
                        error={error.password.error}
                        className="w-full">
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
                        <FormHelperText>{error.password.message}</FormHelperText>
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
                        Registrarse
                    </Button>
                </div>

                {loading && <LinearProgress />}
            </form>
        </Fragment>
    )
}
