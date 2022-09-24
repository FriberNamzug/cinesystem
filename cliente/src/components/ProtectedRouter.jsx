import { Navigate, Outlet } from "react-router-dom"
export const ProtectedRouter = ({ children, redirectTo = "/" }) => {

    const usuario = window.localStorage.getItem("usuario");

    if (!usuario) return <Navigate to={redirectTo} />

    return children ? children : <Outlet />
}
