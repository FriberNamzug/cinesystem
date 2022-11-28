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

import AddGenero from "../../components/peliculas/generos/AddGenero";
import EditGenero from "../../components/peliculas/generos/EditGenero";
import DeleteGenero from "../../components/peliculas/generos/DeleteGenero";
import ShowGenero from "../../components/peliculas/generos/ShowGenero";
import { styleModal } from "../../components/stylesModal";
import SelectorPagina from "../../components/tabla/SelectorPagina";

import { toast } from "react-toastify";

import { obtenerGeneros } from "../../services/generos";

export default function Generos() {
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [generos, setGeneros] = useState([]);
  const [genero, setGenero] = useState();
  const [openGenero, setOpenGenero] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(5);
  const [totalElementos, setTotalElementos] = useState(0);
  const [vistas, setVistas] = useState(5);

  const url = import.meta.env.VITE_RUTA_API;

  const handleOpenAdd = () => setOpenAdd(!openAdd);
  const handleOpenGenero = (data) => { setOpenGenero(!openGenero); setGenero(data); };
  const handleOpenEdit = (data) => { setOpenEdit(!openEdit); setGenero(data); };
  const handleOpenDelete = (data) => { setOpenDelete(!openDelete); setGenero(data); };
  const handleUpdate = () => setUpdate(!update);

  useEffect(() => {
    const getGeneros = async () => {
      setLoading(true);
      try {
        const { data } = await obtenerGeneros(page, vistas);
        console.log(data)
        setCount(data.totalPaginas);
        setTotalElementos(data.total);
        setGeneros(data.generos);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setGeneros([]);
        toast.info(error.response.data.message)
      }
    }
    getGeneros();
  }, [update]);

  const handlePagination = async (event, page) => {
    console.log(page);
    setLoading(true);
    try {
      const { data } = await obtenerGeneros(page, vistas);
      setCount(data.totalPaginas);
      setPage(data.pagina);
      setGeneros(data.generos);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setGeneros([]);
      toast.info(error.response.data.message)
    }
  }

  return (
    <Fragment>
      {loading && (<div className="w-full"><LinearProgress /></div>)}

      <div className="text-center m-5 w-full bg-slate-50 rounded-xl">
        <div className="m-5">
          <h1 className="text-3xl font-bold text-slate-900">Generos</h1>
        </div>
        <div className="m-5">
          <Button
            variant="contained"
            fullWidth
            margin="normal"
            onClick={handleOpenAdd}>Agregar</Button>
        </div>

        <TableContainer >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {generos.map((genero) => (
                <TableRow key={genero.id_genero}>
                  <TableCell>{genero.nombre}</TableCell>
                  <TableCell>
                    <div className="flex flex-row">
                      <div className="m-2">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenGenero(genero)}
                          startIcon={<PreviewIcon />}>Ver</Button>
                      </div>
                      <div className="m-2">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenEdit(genero)}
                          startIcon={<EditIcon />}>Editar</Button>
                      </div>
                      <div className="m-2">
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleOpenDelete(genero)}
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

      <Modal open={openGenero} >
        <div style={styleModal}>
          <ShowGenero genero={genero} close={handleOpenGenero} />
        </div>
      </Modal>
      <Modal open={openAdd} >
        <div style={styleModal}>
          <AddGenero close={handleOpenAdd} update={handleUpdate} />
        </div>
      </Modal>
      <Modal open={openEdit} >
        <div style={styleModal}>
          <EditGenero genero={genero} close={handleOpenEdit} update={handleUpdate} />
        </div>
      </Modal>
      <Modal open={openDelete} >
        <div style={styleModal}>
          <DeleteGenero genero={genero} close={handleOpenDelete} update={handleUpdate} />
        </div>
      </Modal>

    </Fragment>

  )
}
