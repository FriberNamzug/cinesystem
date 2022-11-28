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

import AddDirector from "../../components/peliculas/directores/AddDirector";
import EditDirector from "../../components/peliculas/directores/EditDirector";
import DeleteDirector from "../../components/peliculas/directores/DeleteDirector";
import ShowDirector from "../../components/peliculas/directores/ShowDirector";
import { styleModal } from "../../components/stylesModal";
import SelectorPagina from "../../components/tabla/SelectorPagina";


import { toast } from "react-toastify";

import { obtenerDirectores } from "../../services/directores";
export default function Directores() {
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [directores, setDirectores] = useState([]);
  const [director, setDirector] = useState();
  const [openDirector, setOpenDirector] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(5);
  const [totalElementos, setTotalElementos] = useState(0);
  const [vistas, setVistas] = useState(5);

  const handleOpenAdd = () => setOpenAdd(!openAdd);
  const handleOpenDirector = (data) => { setOpenDirector(!openDirector); setDirector(data); };
  const handleOpenEdit = (data) => { setOpenEdit(!openEdit); setDirector(data); };
  const handleOpenDelete = (data) => { setOpenDelete(!openDelete); setDirector(data); };
  const handleUpdate = () => setUpdate(!update);

  useEffect(() => {
    const getDirectores = async () => {
      setLoading(true);
      try {
        const { data } = await obtenerDirectores(page, vistas);
        console.log(data)
        setCount(data.totalPaginas);
        setTotalElementos(data.total);
        setDirectores(data.directores);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        setDirectores([]);
        toast.info(error.response.data.message)
      }
    }
    getDirectores();
  }, [update]);

  const handlePagination = async (event, page) => {
    console.log(page);
    setLoading(true);
    try {
      const { data } = await obtenerDirectores(page, vistas);
      setCount(data.totalPaginas);
      setPage(data.pagina);
      setDirectores(data.directores);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setActores([]);
      toast.info(error.response.data.message)
    }
  }

  return (
    <Fragment>
      {loading && (<div className="w-full"><LinearProgress /></div>)}

      <div className="text-center m-5 w-full bg-slate-50 rounded-xl">
        <div className="m-5">
          <h1 className="text-3xl font-bold text-slate-900">Directores</h1>
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
                <TableCell>Nombre</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {directores.map((director) => (
                <TableRow key={director.id_director}>
                  <TableCell>{director.nombre}</TableCell>
                  <TableCell>
                    <div className="flex flex-row">
                      <div className="m-2">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenDirector(director)}
                          startIcon={<PreviewIcon />}>Ver</Button>
                      </div>
                      <div className="m-2">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenEdit(director)}
                          startIcon={<EditIcon />}>Editar</Button>
                      </div>
                      <div className="m-2">
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleOpenDelete(director)}
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

      <Modal open={openDirector} >
        <div style={styleModal}>
          <ShowDirector director={director} close={handleOpenDirector} />
        </div>
      </Modal>
      <Modal open={openAdd} >
        <div style={styleModal}>
          <AddDirector close={handleOpenAdd} update={handleUpdate} />
        </div>
      </Modal>
      <Modal open={openEdit} >
        <div style={styleModal}>
          <EditDirector director={director} close={handleOpenEdit} update={handleUpdate} />
        </div>
      </Modal>
      <Modal open={openDelete} >
        <div style={styleModal}>
          <DeleteDirector director={director} close={handleOpenDelete} update={handleUpdate} />
        </div>
      </Modal>

    </Fragment>

  )
}
