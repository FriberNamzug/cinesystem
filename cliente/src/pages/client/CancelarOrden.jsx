import { useState, useEffect, Fragment } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import {
  Button,
  Box,
  Paper,
  TextField,
  LinearProgress,
  FormControl,
  FormLabel,
  Typography,
  Divider,
  FormHelperText
} from '@mui/material'


import { cancelarOrdenCompra } from '../../services/payments'

export default function CancelarOrden() {
  const { id_folio } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await cancelarOrdenCompra(id_folio)
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  return (
    <Fragment>
      <Typography variant="h4" component="h1" gutterBottom>
        Lo sentimos, su orden no pudo ser procesada
      </Typography>
      <Typography variant="body1" gutterBottom>
        Si cree que esto es un error, por favor contacte a nuestro equipo de soporte
      </Typography>
      <Typography variant="body1" gutterBottom>
        Si usted canceló la orden, no se preocupe, no se le cobrará nada
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/')}>
        Volver al inicio
      </Button>
    </Fragment>

  )
}
