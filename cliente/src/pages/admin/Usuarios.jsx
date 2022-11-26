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

import AddUsuario from "../../components/usuarios/AddUsuario";
import EditUsuario from "../../components/usuarios/EditUsuario";
import DeleteUsuario from "../../components/usuarios/DeleteUsuario";
import { styleModal } from "../../components/stylesModal";

import { toast } from "react-toastify";

import { obtenerTodosLosUsuarios } from "../../services/usuarios";


export default function Usuarios() {

  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState();
  const [openUsuario, setOpenUsuario] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const token = localStorage.getItem("token");

  const url = import.meta.env.VITE_RUTA_API;



  const handleOpenAdd = () => setOpenAdd(!openAdd);
  const handleOpenUsuario = (data) => { setOpenUsuario(!openUsuario); setUsuario(data); };
  const handleOpenEdit = (data) => { setOpenEdit(!openEdit); setUsuario(data); };
  const handleOpenDelete = (data) => { setOpenDelete(!openDelete); setUsuario(data); };
  const handleUpdate = () => setUpdate(!update);

  useEffect(() => {
    const getUsuarios = async () => {
      setLoading(true);
      try {
        const { data } = await obtenerTodosLosUsuarios(token);
        console.log(data)
        setUsuarios(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        setUsuarios([]);
        toast.info(error.response.data.message)
      }
    }
    getUsuarios();
  }, [update]);

  return (
    <Fragment>
      {loading && (<div className="w-full"><LinearProgress /></div>)}

      <div className="text-center m-5 w-full bg-slate-50 rounded-xl">
        <div className="m-5">
          <h1 className="text-3xl font-bold text-slate-900">Usuarios</h1>
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
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefono</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>

            </TableHead>

            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id_usuario}>
                  <TableCell>{usuario.id_usuario}</TableCell>
                  <TableCell>{usuario.nombre}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.telefono}</TableCell>
                  <TableCell>{usuario.nombre_rol}</TableCell>
                  <TableCell>
                    <div className="flex flex-row">
                      <div className="m-2">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenEdit(usuario)}
                          startIcon={<EditIcon />}>Editar</Button>
                      </div>
                      <div className="m-2">
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleOpenDelete(usuario)}
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
      <Modal open={openAdd}>
        <div style={styleModal}>
          <AddUsuario close={handleOpenAdd} update={handleUpdate} />
        </div>
      </Modal>
      <Modal open={openEdit}>
        <div style={styleModal}>
          <EditUsuario usuario={usuario} close={handleOpenEdit} update={handleUpdate} />
        </div>
      </Modal>
      <Modal open={openDelete} >
        <div style={styleModal}>
          <DeleteUsuario usuario={usuario} close={handleOpenDelete} update={handleUpdate} />
        </div>
      </Modal>

    </Fragment>
  )

}