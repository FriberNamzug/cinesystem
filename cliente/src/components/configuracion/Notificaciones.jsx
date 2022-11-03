import { useState, useEffect, useRef } from 'react';
import { Switch, FormControlLabel, CircularProgress } from '@mui/material';

import { obtenerUsuario, updateNotificaciones } from '../../services/usuarios';

import { toast } from 'react-toastify'

export default function Notificaciones() {
    const [notificaciones, setNotificaciones] = useState(false);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('token'));
    const prevNotificaciones = useRef();






    useEffect(() => {
        console.log('Notificaciones');
        const getUser = async () => {
            const { data } = await obtenerUsuario(token);
            setLoading(false);
            setNotificaciones(data.notificaciones === 1 ? true : false);
            prevNotificaciones.current = data.notificaciones === 1 ? true : false
            console.log(data);
        }
        getUser();
    }, []);

    const handleChange = async (e) => {
        setNotificaciones(e.target.checked);
        try {
            setLoading(true);
            await updateNotificaciones(token, e.target.checked);
            setLoading(false);
            toast.success('Notificaciones actualizadas');
        } catch (error) {
            setLoading(false);
            setNotificaciones(prevNotificaciones.current);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div>
            {loading && (<div className="flex justify-center items-center"><CircularProgress /></div>)}

            {!loading && (
                <>
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
                </>
            )}
        </div>
    )
}
