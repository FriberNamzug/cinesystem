import { useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import {
  Button,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  AccordionActions,
  Box,
  Paper,
} from '@mui/material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReplyIcon from '@mui/icons-material/Reply';


import { obtenerPeliculasConFunciones } from '../../services/peliculas'

import { toast } from 'react-toastify';



export default function FuncionesOfPeliculaPage() {
  const { id_pelicula } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [peliculas, setPeliculas] = useState([])
  const [funciones, setFunciones] = useState([])
  const [imagenes, setImagenes] = useState([])
  const [expanded, setExpanded] = useState(false);

  const [permissions, setPermissions] = useState("Cargando");
  const [flag, setFlag] = useState(0);

  const url = import.meta.env.VITE_RUTA_API;



  useEffect(() => {
    if (localStorage.getItem("permissions") === null) {
      if (flag < 3) {
        setTimeout(() => {
          setFlag(flag + 1);
          //toast.info("Esperando permisos..." + flag);
        }, 1000);
      } else {
        //toast.error("No se pudo obtener los permisos");
        setPermissions("none");
      }
    } else {
      setPermissions(localStorage.getItem("permissions"));
      //toast.success("Permisos obtenidos");
    }
  }, [flag]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleBack = () => navigate(-1);


  useEffect(() => {
    const getPeliculas = async () => {
      try {
        const response = await obtenerPeliculasConFunciones(id_pelicula, "1", "50")
        setPeliculas(response.data.pelicula)
        setFunciones(response.data.funciones)
        setImagenes(response.data.pelicula.imagenes)
        console.log(response.data)
        setLoading(true)
      } catch (error) {
        toast.error(error.response.data.message)
        navigate('/funciones')
      }

    }
    getPeliculas()
  }, [])

  return (
    <div>
      {!loading && (<div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
      )}
      <div className="flex justify-end">
        <Button onClick={handleBack} className="text-red-500 hover:text-red-700 duration-500">
          <ReplyIcon />
        </Button>
      </div>

      {loading && (

        <Paper
          elevation={3}
          className="flex flex-col justify-center items-center w-full p-4"
          sx={{
            backgroundImage: `url(${imagenes.default ? imagenes.url : url + imagenes.urls[0].url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            backgroundBlendMode: 'multiply',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            color: 'white',
            'user-select': 'none',
            'border-radius': '10px',
          }}
        >
          <Box sx={{ width: '80%', margin: '10px', }}>
            <Paper elevation={3}>
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1 }}>

                  {peliculas.titulo}
                  <Typography variant="body2" color="text.secondary">
                    Sinopsis: {peliculas.sinopsis}
                  </Typography>

                  <Typography variant="body3" color="text.secondary">
                    Fecha de estreno: {peliculas.fecha_estreno}
                  </Typography>

                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, color: 'text.secondary' }}>

                  <Typography variant="body2" sx={{ pr: 1 }}>
                    {peliculas.duracion} min
                  </Typography>

                </Box>
              </Box>
            </Paper>
          </Box>

          {funciones.map((item, index) => {
            //Convertimos la fecha desde y hasta a formato dd/mm/yyyY 
            const fechaDesde = new Date(item.desde)
            const fechaHasta = new Date(item.hasta)
            const fechaDesdeString = fechaDesde.getDate() + "/" + (fechaDesde.getMonth() + 1) + "/" + fechaDesde.getFullYear()
            const fechaHastaString = fechaHasta.getDate() + "/" + (fechaHasta.getMonth() + 1) + "/" + fechaHasta.getFullYear()

            return (
              <Accordion
                key={index}
                expanded={expanded === `panel${index}`}
                onChange={handleChange(`panel${index}`)}
                sx={{ width: '50%', borderRadius: '20px', marginBottom: '10px' }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ width: '50%', flexShrink: 0 }}>
                    Hora de la funcion: {item.horario}
                  </Typography>
                  <Typography sx={{ flexShrink: 0 }}>
                    Capacidad Maxima: {item.aforo}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant='h6' align='center' >
                    Funcion disponible desde y hasta:
                  </Typography>
                  <Typography>
                    Desde el dia: {fechaDesdeString}
                  </Typography>
                  <Typography>
                    Hasta el dia: {fechaHastaString}
                  </Typography>

                  <Typography>
                    Precio del boleto general: {item.costo_boleto}
                  </Typography>
                  <Typography>
                    Sala: {item.sala}
                  </Typography>
                  <Typography>
                    Hasta el momento hay {"item.cantidad_boletos"} boletos vendidos y {"item.aforo - item.cantidad_boletos"} boletos disponibles
                  </Typography>
                </AccordionDetails>
                <AccordionActions>
                  {permissions === "Usuario" && (
                    <Button variant='contained' size="small" onClick={() => navigate(`/dashboard/comprar/${item.id_funcion}`)}>Comprar Boleto</Button>
                  )}
                  {permissions === "none" && (
                    <Button variant='contained' size="small" onClick={() => navigate(`/login`)}>Iniciar Sesion</Button>
                  )}
                  {permissions === "Cargando" && (
                    <Button variant='contained' size="small" disabled>Iniciar Sesion</Button>
                  )}

                </AccordionActions>
              </Accordion>
            )
          })}

        </Paper>


      )
      }

    </div >
  )
}
