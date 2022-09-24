import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HCaptcha from "@hcaptcha/react-hcaptcha";

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

export default function Login() {

  const KEY_CAPTCHA = import.meta.env.VITE_HCAPTCHA_KEY;
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [dataUsuario, setDataUsuario] = useState({
    usuario: "",
    password: "",
    showPassword: false,
  });
  const captchaRef = useRef(null);


  const navigate = useNavigate();

  const handleChange = (e) => {
    setDataUsuario({ ...dataUsuario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("Por favor verifica el captcha");
    setLoading(true);
    try {
      toast.success("Bienvenido");
      window.localStorage.setItem("usuario", "Test");
      navigate("/dashboard");
    } catch (error) {
      setToken("");
      setLoading(false);
      toast.error("Algo salió mal, por favor intenta de nuevo");
      captchaRef.current.resetCaptcha();
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
      <form onSubmit={handleSubmit}>
        <TextField
          label="Usuario"
          type="text"
          name="usuario"
          onChange={handleChange}
          size="medium"
          variant="outlined"
          margin="normal"
          fullWidth
          autoComplete="usuario"
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
        />

        <FormControl variant="outlined" className="w-full">
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

        <HCaptcha
          ref={captchaRef}
          sitekey={KEY_CAPTCHA}
          onVerify={(token, ekey) => setToken(token)}
          onExpire={(e) => setToken("")}
          onError={(e) => console.log(e)}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth>
          Iniciar Sesión
        </Button>
      </form>
  )
}
