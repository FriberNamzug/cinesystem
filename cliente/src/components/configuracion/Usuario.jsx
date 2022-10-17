import { useState, useEffect } from 'react';
import { LinearProgress, TextField, Button } from "@mui/material"

import { obtenerUsuario, updateUsuario } from '../../services/usuarios';

import { toast } from 'react-toastify'

export default function Usuario() {
  const [usuario, setUsuario] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(window.localStorage.getItem('token'));


  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const { data } = await obtenerUsuario(token);
      setUsuario(data);
      setLoading(false);
    }
    getUser();
  }, []);

  const handleChange = async (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(usuario);
    setLoading(true);
    try {
      const { data } = await updateUsuario(token, usuario);
      toast.success(data.message);
      console.log(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error)
      toast.error(error.response.data.message);
    }
  }

  return (
    <div>
      <h1 className="text-center text-3xl mb-4">Configuracion del usuario</h1>
      <div className='flex flex-col items-center'>
        {usuario && (
          <form className='flex flex-col w-full' onSubmit={handleSubmit}>
            <TextField
              label="Nombre"
              type="text"
              disabled={loading}
              value={usuario.nombre || ''}
              onChange={handleChange}
              name='nombre'
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              type="email"
              disabled={loading}
              value={usuario.email || ''}
              onChange={handleChange}
              name='email'
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Telefono"
              type="text"
              disabled={loading}
              value={usuario.telefono || ''}
              onChange={handleChange}
              name='telefono'
              variant="outlined"
              fullWidth
              margin="normal"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
              sx={{ marginTop: 2 }}
            >
              {loading ? <LinearProgress size={24} /> : 'Guardar'}
            </Button>
          </form>
        )}



      </div>
    </div>
  )
}
