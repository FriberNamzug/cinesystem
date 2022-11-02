import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useValidateToken = () => {
    const navigate = useNavigate();
    try {
        const [loading, setLoading] = useState();
        const [token, setToken] = useState(JSON.parse(localStorage.getItem('token')));

        useEffect(() => {
            validacion();
        }, [loading]);

        const validacion = async () => {

            try {
                const response = await axios.get('/auth/verifytoken', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    axios.defaults.headers.common['Content-Type'] = 'application/json';
                    return response;
                } else {
                    //Borramos todo lo que exista en el localStorage
                    localStorage.clear();
                    //Manda un mensaje de error
                    toast.error('Sesión expirada. Inicia sesión nuevamente.');
                    navigate('/');
                    return
                }
            } catch (error) {
                //Borramos todo lo que exista en el localStorage
                localStorage.clear();
                //Manda un mensaje de error
                toast.error('Sesión expirada. Inicia sesión nuevamente.');
                navigate('/');
            }
        }
    } catch (error) {
        //Borramos todo lo que exista en el localStorage
        localStorage.clear();
        //Manda un mensaje de error
        toast.error("Ocurrió un error. Inicia sesión nuevamente.");
        navigate('/');
    }
};


export default useValidateToken;