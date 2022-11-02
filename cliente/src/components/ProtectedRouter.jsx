import { Navigate, Outlet, useNavigate } from "react-router-dom"
import axios from 'axios';
import { verificarToken } from "../services/auth";
import { toast } from 'react-toastify';

export const ProtectedRouter = ({ permisos, redirectTo = "/" }) => {
    const navigate = useNavigate();

    try {
        const token = localStorage.getItem("token")
        if (!token) return <Navigate to={redirectTo} />

        verificarToken(token)
            .catch(err => {
                toast.error(err.response.data.message || err.message)
                localStorage.removeItem("token")
                console.log("PROTECTED ROUTER PROTEGIENDO XD")
                return navigate(redirectTo)
            }).then(res => {
                localStorage.setItem("permissions", res.data.data.permissions)
                const permissions = res.data.data.permissions

                if (permisos) {
                    if (!permisos.some(permiso => permissions.includes(permiso))) {
                        console.log("NO TIENE PERMISOS")
                        toast.error("No tiene permisos para acceder a esta ruta")
                        //Redireccionamos a la pagina anterior
                        return navigate(-1)
                    }
                }
            })



        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        return <Outlet />


    } catch (error) {
        console.log(error)
        toast.error("Ocurrió un error. Intente nuevamente");
    }
}
