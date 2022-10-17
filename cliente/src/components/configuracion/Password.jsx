import { useState } from 'react'

import { LinearProgress, TextField, Button, Collapse } from "@mui/material"

import { Alert } from "@mui/material"

import { toast } from 'react-toastify'

import { validacionCambiarPassword, error as err } from '../../validations/configuracion'

import { updatePassword } from '../../services/usuarios'

export default function Password() {
  const [password, setPassword] = useState({
    oldPassword: '',
    newPassword: '',
    newPasswordVerify: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(err);
  const [token, setToken] = useState(window.localStorage.getItem('token'));

  const handleChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value
    });
    setError({
      ...error,
      [e.target.name]: validacionCambiarPassword(e, password)
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error.newPassword.error || error.newPasswordVerify.error || error.oldPassword.error) return toast.error('Soluciona los errores en el formulario');
    setLoading(true);
    try {
      console.log(password);
      await updatePassword(token, password);
      setPassword({})
      setError(err)
      setLoading(false);
      toast.success('Contraseña actualizada');
    } catch (error) {
      setLoading(false);
      console.log(error)
      toast.error(error.response.data.message);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className='flex flex-col w-full'>
        <TextField
          label="Contraseña Actual"
          type="password"
          helperText={error.oldPassword.message}
          error={error.oldPassword.error}
          disabled={loading}
          value={password.oldPassword || ''}
          onChange={handleChange}
          name='oldPassword'
          variant="outlined"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Nueva Contraseña"
          type="password"
          helperText={error.newPassword.message}
          error={error.newPassword.error}
          disabled={loading}
          value={password.newPassword || ''}
          onChange={handleChange}
          name='newPassword'
          variant="outlined"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Confirmar Contraseña"
          type="password"
          helperText={error.newPasswordVerify.message}
          error={error.newPasswordVerify.error}
          disabled={loading}
          value={password.newPasswordVerify || ''}
          onChange={handleChange}
          name='newPasswordVerify'
          variant="outlined"
          fullWidth
          margin="normal"
          required
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <LinearProgress color="info" />
          ) : (
            "Cambiar Contraseña"
          )}
        </Button>
      </form>
    </>
  )
}