import { useState } from 'react'

import { CircularProgress, TextField, Button, Collapse } from "@mui/material"

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


import { toast } from 'react-toastify'

import { validarPassword, error as err } from '../../validations/configuracion'

export default function Password() {
  const [password, setPassword] = useState({
    oldPassword: '',
    newPassword: '',
    newPasswordVerify: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(err);

  const handleChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value
    });
    setError({
      ...error,
      [e.target.name]: validarPassword(e, password)
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error.newPassword.error || error.newPasswordVerify.error || error.oldPassword.error) return toast.error('Soluciona los errores en el formulario');
    setLoading(true);
    try {
      setPassword({})
      setError(err)
      setLoading(false);
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
            <CircularProgress color="info" />
          ) : (
            "Cambiar Contraseña"
          )}
        </Button>
      </form>
    </>
  )
}