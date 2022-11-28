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

import AddIdioma from "../../components/peliculas/idiomas/AddIdioma";
import EditIdioma from "../../components/peliculas/idiomas/EditIdioma";
import DeleteIdioma from "../../components/peliculas/idiomas/DeleteIdioma";
import ShowIdioma from "../../components/peliculas/idiomas/ShowIdioma";

import { styleModal } from "../../components/stylesModal";
import SelectorPagina from "../../components/tabla/SelectorPagina";
import { toast } from "react-toastify";
import { obtenerIdiomas } from "../../services/idiomas";


export default function Idiomas() {

  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [idiomas, setIdiomas] = useState([]);
  const [idioma, setIdioma] = useState();
  const [openIdioma, setOpenIdioma] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(5);
  const [totalElementos, setTotalElementos] = useState(0);
  const [vistas, setVistas] = useState(5);

  const url = import.meta.env.VITE_RUTA_API;


  const handleOpenAdd = () => setOpenAdd(!openAdd);
  const handleOpenIdioma = (data) => { setOpenIdioma(!openIdioma); setIdioma(data); };
  const handleOpenEdit = (data) => { setOpenEdit(!openEdit); setIdioma(data); };
  const handleOpenDelete = (data) => { setOpenDelete(!openDelete); setIdioma(data); };
  const handleUpdate = () => setUpdate(!update);

  useEffect(() => {
    const getIdiomas = async () => {
      setLoading(true);
      try {
        const { data } = await obtenerIdiomas(page, vistas);
        console.log(data)
        setCount(data.totalPaginas);
        setTotalElementos(data.total);
        setIdiomas(data.idiomas);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setIdiomas([]);
        toast.info(error.response.data.message)
      }
    }
    getIdiomas();
  }, [update]);

  const handlePagination = async (event, page) => {
    console.log(page);
    setLoading(true);
    try {
      const { data } = await obtenerIdiomas(page, vistas);
      setCount(data.totalPaginas);
      setPage(data.pagina);
      setIdiomas(data.idiomas);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIdiomas([]);
      toast.info(error.response.data.message)
    }
  }


  return (
    <Fragment>
      {loading && (<div className="w-full"><LinearProgress /></div>)}

      <div className="text-center m-5 w-full bg-slate-50 rounded-xl">
        <div className="m-5">
          <h1 className="text-3xl font-bold text-slate-900">Idiomas</h1>
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
                <TableCell>Idioma</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {idiomas.map((idioma) => (
                <TableRow key={idioma.id_idioma}>
                  <TableCell>{idioma.nombre}</TableCell>
                  <TableCell>
                    <div className="flex flex-row">
                      <div className="m-2">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenIdioma(idioma)}
                          startIcon={<PreviewIcon />}>Ver</Button>
                      </div>
                      <div className="m-2">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenEdit(idioma)}
                          startIcon={<EditIcon />}>Editar</Button>
                      </div>
                      <div className="m-2">
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleOpenDelete(idioma)}
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

      <Modal open={openIdioma} >
        <div style={styleModal}>
          <ShowIdioma
            idioma={idioma}
            close={handleOpenIdioma}
          />
        </div>
      </Modal>

      <Modal open={openAdd}>
        <div style={styleModal}>
          <AddIdioma
            close={handleOpenAdd}
            update={handleUpdate}
          />
        </div>
      </Modal>

      <Modal open={openEdit} >
        <div style={styleModal}>
          <EditIdioma
            idioma={idioma}
            close={handleOpenEdit}
            update={handleUpdate}
          />
        </div>
      </Modal>

      <Modal open={openDelete}  >
        <div style={styleModal}>
          <DeleteIdioma
            idioma={idioma}
            close={handleOpenDelete}
            update={handleUpdate}
          />
        </div>
      </Modal>

    </Fragment>
  )
}
