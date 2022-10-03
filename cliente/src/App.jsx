import { Fragment, useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRouter } from './components/ProtectedRouter'

import Index from './pages/public/Index'
import NotFound from './pages/public/NotFound'
import Login from './pages/public/Login'
import Dashboard from './pages/admin/Dashboard'
import Admin from './pages/admin/Admin'
import Auth2FA from './pages/Auth2FA'

import ActivarCuenta from './pages/public/ActivarCuenta'

import Toast from './components/Toast'
import RoutesDashboard from './components/RoutesDashboard'


function App() {

  const [usuario, setUsuario] = useState(null)
  return (
    <Fragment>
      <Routes>

        <Route index element={<Index />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/activar-cuenta/:token" element={<ActivarCuenta />} />
        <Route path="/2fa" element={<Auth2FA />} />
        <Route path="/category/" element={<Index />} />



        {/* Rutas que solo puedes ingresar despues de hacer login */}
        <Route element={<ProtectedRouter permisos={["Usuario"]} />} >
          <Route path="dashboard" element={<RoutesDashboard />}>
            <Route index element={<Dashboard />} />
            <Route index element={<Dashboard />} />
          </Route>
        </Route>

        {/* Rutas que necesitan permiso de administrador */}
        <Route element={<ProtectedRouter permisos={["Administrador"]} />} >
          <Route path="admin" element={<Admin />} />
        </Route>


      </Routes>
      <Toast />
    </Fragment>
  )
}

export default App
