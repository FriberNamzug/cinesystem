import { useState, useEffect, Fragment } from "react";
import {
  CircularProgress,
  Table,
  TableContainer,
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Button,
  Modal,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import AddFuncion from "../../components/funciones/AddFuncion";
import EditFuncion from "../../components/funciones/EditFuncion";
import DisableFuncion from "../../components/funciones/DisableFuncion";

import { toast } from "react-toastify";
import { styleModal } from "../../components/stylesModal";

import { obtenerFunciones } from "../../services/funciones";


export default function Funciones() {

  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [funciones, setFunciones] = useState([]);
  const [funcion, setFuncion] = useState();
  const [openFuncion, setOpenFuncion] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleOpenAdd = () => setOpenAdd(!openAdd);
  const handleOpenFuncion = (data) => { setOpenFuncion(!openFuncion); setFuncion(data); };
  const handleOpenEdit = (data) => { setOpenEdit(!openEdit); setFuncion(data); };
  const handleOpenDelete = (data) => { setOpenDelete(!openDelete); setFuncion(data); };
  const handleUpdate = () => setUpdate(!update);

  useEffect(() => {
    const getFunciones = async () => {
      try {
        const { data } = await obtenerFunciones();
        setFunciones(data.sort((a, b) => b.id_funcion - a.id_funcion));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setFunciones([]);
        toast.info(error.response.data.message)
      }
    }
    getFunciones();
  }, [update]);


  return (
    <Fragment>
      {loading && (<div className="flex justify-center items-center h-screen"><CircularProgress /></div>)}


      {!loading && (
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">Funciones</h1>
          </div>
          <div className="flex flex-col items-center bg-white rounded-md shadow-md">
            <Button
              variant="contained"
              fullWidth
              margin="normal"
              onClick={handleOpenAdd}>Agregar</Button>
            <TableContainer >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID Funcion</TableCell>
                    <TableCell>Titulo</TableCell>
                    <TableCell>Aforo</TableCell>
                    <TableCell>Sala</TableCell>
                    <TableCell>Horario</TableCell>
                    <TableCell>Fechas</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {funciones.map((funcion) => (
                    <TableRow key={funcion.id_funcion}>
                      <TableCell>{funcion.id_funcion}</TableCell>
                      <TableCell>{funcion.titulo}</TableCell>
                      <TableCell>{funcion.aforo}</TableCell>
                      <TableCell>{funcion.sala}</TableCell>
                      <TableCell>{funcion.horario}</TableCell>
                      <TableCell>{new Date(funcion.desde).toLocaleDateString()} - {new Date(funcion.hasta).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex flex-row">
                          <div className="m-2">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleOpenEdit(funcion)}
                              startIcon={<EditIcon />}>Editar</Button>
                          </div>
                          <div className="m-2">
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleOpenDelete(funcion)}
                              startIcon={<DeleteIcon />}>Deshabilitar</Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      )}


      <Modal open={openAdd} >
        <div style={styleModal}>
          <AddFuncion close={handleOpenAdd} update={handleUpdate} />
        </div>
      </Modal>
      <Modal open={openEdit} >
        <div style={styleModal}>
          <EditFuncion funcion={funcion} close={handleOpenEdit} update={handleUpdate} />
        </div>
      </Modal>
      <Modal open={openDelete} >
        <div style={styleModal}>
          <DisableFuncion funcion={funcion} close={handleOpenDelete} update={handleUpdate} />
        </div>
      </Modal>

    </Fragment>
  )
}
