import { useState, useEffect, Fragment } from "react";
import {
  LinearProgress,
  Table,
  TableContainer,
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Button,
  Modal,
  Stack,
  Pagination
} from "@mui/material";

import PreviewIcon from '@mui/icons-material/Preview';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import AddPelicula from "../../components/peliculas/peliculas/AddPelicula";
import EditPelicula from "../../components/peliculas/peliculas/EditPelicula";
import DeletePelicula from "../../components/peliculas/peliculas/DeletePelicula";
import ShowPelicula from "../../components/peliculas/peliculas/ShowPelicula";
import { styleModal } from "../../components/stylesModal";
import SelectorPagina from "../../components/tabla/SelectorPagina";

import { toast } from "react-toastify";

import { obtenerPeliculas } from "../../services/peliculas";


export default function Peliculas() {

  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [peliculas, setPeliculas] = useState([]);
  const [pelicula, setPelicula] = useState();
  const [openPelicula, setOpenPelicula] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(5);
  const [totalElementos, setTotalElementos] = useState(0);
  const [vistas, setVistas] = useState(5);

  const url = import.meta.env.VITE_RUTA_API;



  const handleOpenAdd = () => setOpenAdd(!openAdd);
  const handleOpenPelicula = (data) => { setOpenPelicula(!openPelicula); setPelicula(data); };
  const handleOpenEdit = (data) => { setOpenEdit(!openEdit); setPelicula(data); };
  const handleOpenDelete = (data) => { setOpenDelete(!openDelete); setPelicula(data); };
  const handleUpdate = () => setUpdate(!update);

  useEffect(() => {
    const getPelis = async () => {
      setLoading(true);
      try {
        const { data } = await obtenerPeliculas(page, vistas);
        console.log(data)
        setCount(data.totalPaginas);
        setTotalElementos(data.total);
        setPeliculas(data.peliculas);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        setPeliculas([]);
        toast.info(error.response.data.message)
      }
    }
    getPelis();
  }, [update]);

  const handlePagination = async (event, page) => {
    console.log(page);
    setLoading(true);
    try {
      const { data } = await obtenerPeliculas(page, vistas);
      setCount(data.totalPaginas);
      setPage(data.pagina);
      setPeliculas(data.peliculas);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
      setPeliculas([]);
      toast.info(error.response.data.message)
    }
  }

  return (
    <Fragment>
      {loading && (<div className="w-full"><LinearProgress /></div>)}

      <div className="text-center m-5 w-full bg-slate-50 rounded-xl">
        <div className="m-5">
          <h1 className="text-3xl font-bold text-slate-900">Peliculas</h1>
        </div>
        <div className="m-5">
          <Button
            variant="contained"
            fullWidth
            margin="normal"
            onClick={handleOpenAdd}>Agregar</Button>
        </div>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Imagen</TableCell>
                <TableCell>Titulo</TableCell>
                <TableCell>Sinopsis</TableCell>
                <TableCell>Fecha Estreno</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>

            </TableHead>

            <TableBody>
              {peliculas.map((pelicula) => (
                <TableRow key={pelicula.id_pelicula}>
                  <TableCell>
                    <img
                      src={pelicula.imagen.default ? `${pelicula.imagen.url}` : `${url}/${pelicula.imagen.url}`}
                      alt={pelicula.titulo}
                      className="w-20 h-20" />
                  </TableCell>
                  <TableCell>{pelicula.titulo}</TableCell>
                  <TableCell>{pelicula.sinopsis}</TableCell>
                  <TableCell>{new Date(pelicula.fecha_estreno).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex flex-row">
                      <div className="m-2">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenPelicula(pelicula)}
                          startIcon={<PreviewIcon />}>Ver</Button>
                      </div>
                      <div className="m-2">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenEdit(pelicula)}
                          startIcon={<EditIcon />}>Editar</Button>
                      </div>
                      <div className="m-2">
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleOpenDelete(pelicula)}
                          startIcon={<DeleteIcon />}>Eliminar</Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Stack spacing={2} alignItems={"center"}>
            <Pagination count={count} page={page} variant="outlined" shape="rounded" onChange={handlePagination} />
            <div className="w-96">
              <SelectorPagina count={count} totalElementos={totalElementos} setVistas={setVistas} vistas={vistas} update={handleUpdate} />
            </div>
          </Stack>
        </TableContainer>
      </div>
      <Modal open={openPelicula} >
        <div style={styleModal}>
          <ShowPelicula pelicula={pelicula} close={handleOpenPelicula} update={handleUpdate} />
        </div>
      </Modal>
      <Modal open={openAdd}>
        <div style={styleModal}>
          <AddPelicula close={handleOpenAdd} update={handleUpdate} />
        </div>
      </Modal>
      <Modal open={openEdit}>
        <div style={styleModal}>
          <EditPelicula pelicula={pelicula} close={handleOpenEdit} update={handleUpdate} />
        </div>
      </Modal>
      <Modal open={openDelete} >
        <div style={styleModal}>
          <DeletePelicula pelicula={pelicula} close={handleOpenDelete} update={handleUpdate} />
        </div>
      </Modal>

    </Fragment>
  )

}