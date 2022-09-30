import { Fragment, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRouter } from './components/ProtectedRouter'

import Index from './pages/Index'
import NotFound from './pages/NotFound'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'

import Toast from './components/Toast'


function App() {

  return (
    <Fragment>
      <Routes>

        <Route index element={<Index />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRouter />} >
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<ProtectedRouter />} >
          <Route path="admin" element={<Admin />} />
        </Route>


      </Routes>
      <Toast />
    </Fragment>
  )
}

export default App
