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

import AddActor from "../../components/peliculas/actores/AddActor";
import EditActor from "../../components/peliculas/actores/EditActor";
import DeleteActor from "../../components/peliculas/actores/DeleteActor";
import ShowActor from "../../components/peliculas/actores/ShowActor";
import { styleModal } from "../../components/stylesModal";
import SelectorPagina from "../../components/tabla/SelectorPagina";

import { toast } from "react-toastify";

import { obtenerActores } from "../../services/actores";

export default function Actores() {
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [actores, setActores] = useState([]);
  const [actor, setActor] = useState();
  const [openActor, setOpenActor] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(5);
  const [totalElementos, setTotalElementos] = useState(0);
  const [vistas, setVistas] = useState(5);

  const url = import.meta.env.VITE_RUTA_API;

  const handleOpenAdd = () => setOpenAdd(!openAdd);
  const handleOpenActor = (data) => { setOpenActor(!openActor); setActor(data); };
  const handleOpenEdit = (data) => { setOpenEdit(!openEdit); setActor(data); };
  const handleOpenDelete = (data) => { setOpenDelete(!openDelete); setActor(data); };
  const handleUpdate = () => setUpdate(!update);

  useEffect(() => {
    const getActores = async () => {
      setLoading(true);
      try {
        const { data } = await obtenerActores(page, vistas);
        setCount(data.totalPaginas);
        setTotalElementos(data.total);
        setActores(data.actores);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setActores([]);
        toast.info(error.response.data.message)
      }
    }
    getActores();
  }, [update]);


  const handlePagination = async (event, page) => {
    console.log(page);
    setLoading(true);
    try {
      const { data } = await obtenerActores(page, vistas);
      setCount(data.totalPaginas);
      setPage(data.pagina);
      setActores(data.actores);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setActores([]);
      console.log(error);
      toast.info(error.response.data.message)
    }
  }

  return (
    <Fragment>
      {loading && (<div className="w-full"><LinearProgress /></div>)}

      <div className="text-center m-5 w-full bg-slate-50 rounded-xl">
        <div className="m-5">
          <h1 className="text-3xl font-bold text-slate-900">Actores</h1>
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
                <TableCell>Fotografia</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>

            </TableHead>
            <TableBody>
              {actores.map((actor) => (
                <TableRow key={actor.id_actor}>
                  <TableCell>
                    <img src={`${url}/${actor.imagen}`} alt={actor.nombre} className="w-20 h-20" />
                  </TableCell>
                  <TableCell>{actor.nombre}</TableCell>
                  <TableCell>
                    <div className="flex flex-row">
                      <div className="m-2">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenActor(actor)}
                          startIcon={<PreviewIcon />}>Ver</Button>
                      </div>
                      <div className="m-2">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenEdit(actor)}
                          startIcon={<EditIcon />}>Editar</Button>
                      </div>
                      <div className="m-2">
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleOpenDelete(actor)}
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

      <Modal open={openActor} >
        <div style={styleModal}>
          <ShowActor actor={actor} close={handleOpenActor} />
        </div>
      </Modal>
      <Modal open={openAdd} >
        <div style={styleModal}>
          <AddActor close={handleOpenAdd} update={handleUpdate} />
        </div>
      </Modal>
      <Modal open={openEdit} >
        <div style={styleModal}>
          <EditActor actor={actor} close={handleOpenEdit} update={handleUpdate} />
        </div>
      </Modal>
      <Modal open={openDelete} >
        <div style={styleModal}>
          <DeleteActor actor={actor} close={handleOpenDelete} update={handleUpdate} />
        </div>
      </Modal>

    </Fragment>
  )
}
