import { Navigate, Outlet } from "react-router-dom"
import axios from 'axios';

import { useState } from "react";

import { verificarToken } from "../services/auth";

import { toast } from 'react-toastify';



export const ProtectedRouter = ({ permisos, redirectTo = "/" }) => {

    try {
        const token = localStorage.getItem("token")
        const [permiso, setPermiso] = useState(null)

        if (!token) return <Navigate to={redirectTo} />

        verificarToken(token).catch(err => {
            toast.error(err.response.data.message || err.message)
            localStorage.removeItem("token")
            return <Navigate to={redirectTo} />
        }).then(res => {
            setPermiso(res.data.permiso)
            console.log(res)
        })

        if (permisos.includes(permiso)) {
            console.log("Tiene permiso")
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        return <Outlet />


    } catch (error) {
        console.log(error)
        toast.error("Ocurrió un error. Intente nuevamente");
    }
}
