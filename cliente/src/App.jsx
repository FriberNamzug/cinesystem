import { Fragment, useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRouter } from './components/ProtectedRouter'

import Index from './pages/public/Index'
import NotFound from './pages/public/NotFound'
import FuncionesPage from './pages/public/FuncionesPage'
import FuncionesOfPeliculaPage from './pages/public/FuncionesOfPeliculaPage'
import GenerosPage from './pages/public/GenerosPage'
import GeneroPage from './pages/public/GeneroPage'

import Login from './pages/global/Login'
import Auth2FA from './pages/global/Auth2FA'
import ActivarCuenta from './pages/global/ActivarCuenta'
import RecuperarPassword from './pages/global/RecuperarPassword'

import Dashboard from './pages/admin/Dashboard'
import Configuracion from './pages/admin/Configuracion'
import Usuarios from './pages/admin/Usuarios'
import Funciones from './pages/admin/Funciones'
import Peliculas from './pages/admin/Peliculas'

import Actores from './pages/admin/Actores'
import Directores from './pages/admin/Directores'
import Generos from './pages/admin/Generos'
import Idiomas from './pages/admin/Idiomas'
import Disponibilidad from './pages/admin/Disponibilidad'

import Boletos from './pages/client/Boletos'
import Historial from './pages/client/Historial'
import Comprar from './pages/client/Comprar'


import Toast from './components/Toast'

import RoutesDashboard from './components/RoutesDashboard'
import RoutesPeliculas from './components/RoutesPeliculas'
import RoutesPublicPages from './components/RoutesPublicPages'


function App() {

  return (
    <Fragment>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/activar-cuenta/:token" element={<ActivarCuenta />} />
        <Route path="/2fa" element={<Auth2FA />} />
        <Route path="/recuperar_password/:token" element={<RecuperarPassword />} />

        <Route path="/" element={<RoutesPublicPages />}>
          <Route index element={<Index />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/funciones/" element={<FuncionesPage />} />
          <Route path="/funciones/:id_pelicula" element={<FuncionesOfPeliculaPage />} />
          <Route path="/generos/" element={<GenerosPage />} />
          <Route path="/generos/:id_genero" element={<GeneroPage />} />
        </Route>

        <Route element={<ProtectedRouter permisos={["Usuario", "Administrador"]} />} >
          <Route path="dashboard" element={<RoutesDashboard />}>
            <Route index element={<Dashboard />} />
            <Route path="settings" element={<Configuracion />} />

            <Route element={<ProtectedRouter permisos={["Usuario"]} />} >
              <Route path="funcion/" element={<FuncionesPage />} />
              <Route path="funcion/:id_pelicula" element={<FuncionesOfPeliculaPage />} />
              <Route path="tickets" element={<Boletos />} />
              <Route path="history" element={<Historial />} />
              <Route path="comprar/:id_funcion" element={<Comprar />} />
            </Route>

            <Route element={<ProtectedRouter permisos={["Administrador"]} />} >
              <Route path="settings" element={<Configuracion />} />
              <Route path="usuarios" element={<Usuarios />} />
              <Route path="funciones" element={<Funciones />} />

              <Route path="peliculas" element={<RoutesPeliculas />} >
                <Route index element={<Peliculas />} />
                <Route path="actores" element={<Actores />} />
                <Route path="directores" element={<Directores />} />
                <Route path="generos" element={<Generos />} />
                <Route path="idiomas" element={<Idiomas />} />
                <Route path="Disponibilidad" element={<Disponibilidad />} />
              </Route>

            </Route>

          </Route>
        </Route>




      </Routes>
      <Toast />
    </Fragment>
  )
}

export default App
