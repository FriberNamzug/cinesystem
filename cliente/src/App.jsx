import { Fragment, useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRouter } from './components/ProtectedRouter'

import Index from './pages/public/Index'
import NotFound from './pages/public/NotFound'
import Login from './pages/global/Login'
import Auth2FA from './pages/global/Auth2FA'
import ActivarCuenta from './pages/global/ActivarCuenta'

import Dashboard from './pages/admin/Dashboard'
import Admin from './pages/admin/Admin'
import Configuracion from './pages/admin/Configuracion'
import Usuarios from './pages/admin/Usuarios'
import Funciones from './pages/admin/Funciones'
import Peliculas from './pages/admin/Peliculas'



import Toast from './components/Toast'
import RoutesDashboard from './components/RoutesDashboard'


function App() {

  return (
    <Fragment>
      <Routes>

        <Route index element={<Index />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/category/" element={<Index />} />


        <Route path="/login" element={<Login />} />
        <Route path="/activar-cuenta/:token" element={<ActivarCuenta />} />
        <Route path="/2fa" element={<Auth2FA />} />


        <Route element={<ProtectedRouter permisos={["Administrador"]} />} >
          <Route path="dashboard" element={<RoutesDashboard />}>
            <Route index element={<Dashboard />} />
            <Route path="admin" element={<Admin />} />
            <Route path="settings" element={<Configuracion />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="peliculas" element={<Peliculas />} />
            <Route path="funciones" element={<Funciones />} />
          </Route>
        </Route>

        <Route element={<ProtectedRouter permisos={["Usuario"]} />} >
        </Route>


      </Routes>
      <Toast />
    </Fragment>
  )
}

export default App
