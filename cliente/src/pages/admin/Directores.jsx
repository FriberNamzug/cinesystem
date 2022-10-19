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
} from "@mui/material";

import PreviewIcon from '@mui/icons-material/Preview';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import AddDirector from "../../components/peliculas/directores/AddDirector";
import EditDirector from "../../components/peliculas/directores/EditDirector";
import DeleteDirector from "../../components/peliculas/directores/DeleteDirector";
import ShowDirector from "../../components/peliculas/directores/ShowDirector";
import { styleModal } from "../../components/stylesModal";


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

  const url = import.meta.env.VITE_RUTA_API;

  const handleOpenAdd = () => setOpenAdd(!openAdd);
  const handleOpenDirector = (data) => { setOpenDirector(!openDirector); setDirector(data); };
  const handleOpenEdit = (data) => { setOpenEdit(!openEdit); setDirector(data); };
  const handleOpenDelete = (data) => { setOpenDelete(!openDelete); setDirector(data); };
  const handleUpdate = () => setUpdate(!update);

  useEffect(() => {
    const getDirectores = async () => {
      setLoading(true);
      try {
        const { data } = await obtenerDirectores("1", "50");
        console.log(data)
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
                <TableCell>Apellido</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {directores.map((director) => (
                <TableRow key={director.id_director}>
                  <TableCell>{director.nombre}</TableCell>
                  <TableCell>{director.apellido}</TableCell>
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
