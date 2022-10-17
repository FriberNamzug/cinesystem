import { useState, useEffect, useRef } from 'react';
import { Switch, FormControlLabel } from '@mui/material';

import { obtenerUsuario, updateNotificaciones } from '../../services/usuarios';

import { toast } from 'react-toastify'

export default function Notificaciones() {
    const [notificaciones, setNotificaciones] = useState(false);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(window.localStorage.getItem('token'));
    const prevNotificaciones = useRef();

    




    useEffect(() => {
        console.log('Notificaciones');
        const getUser = async () => {
            const { data } = await obtenerUsuario(token);
            setNotificaciones(data.notificaciones === 1 ? true : false);
            prevNotificaciones.current = data.notificaciones === 1 ? true : false
            console.log(data);
        }
        getUser();
    }, []);

    const handleChange = async (e) => {
        setNotificaciones(e.target.checked);
        try {
            await updateNotificaciones(token, e.target.checked);
            toast.success('Notificaciones actualizadas');
        } catch (error) {
            setNotificaciones(prevNotificaciones.current);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div>
            <h1 className="text-center text-3xl mb-4">Notificaciones</h1>
            <div className='flex flex-col items-center'>
                <p className='mb-14'>
                    Desde esta sección puedes configurar si deseas recibir notificaciones por whatsapp.
                </p>

                <FormControlLabel
                    control={
                        <Switch
                            checked={notificaciones}
                            onChange={handleChange} />
                    }
                    label={notificaciones ? 'Notificaciones Activadas' : 'Notificaciones Desactivadas'}
                />
            </div>
        </div>
    )
}
