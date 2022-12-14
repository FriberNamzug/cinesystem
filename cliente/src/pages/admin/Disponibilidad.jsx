import { useState, useEffect, Fragment } from "react";
import {
    LinearProgress,
    Table,
    TableContainer,
    TableCell,
    TableHead,
    TableBody,
    TableRow,
    Switch,
    FormControlLabel,
    Stack,
    Pagination
} from "@mui/material";

import { obtenerPeliculas } from "../../services/peliculas";
import { updateDisponibilidad } from "../../services/peliculas";

import { toast } from "react-toastify";
import SelectorPagina from "../../components/tabla/SelectorPagina";


export default function Disponibilidad() {

    const [loading, setLoading] = useState(false);
    const [desactivar, setDesactivar] = useState(false);
    const [update, setUpdate] = useState(false);
    const [peliculas, setPeliculas] = useState([]);
    const [token, setToken] = useState(window.localStorage.getItem('token'));
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(5);
    const [totalElementos, setTotalElementos] = useState(0);
    const [vistas, setVistas] = useState(5);

    const url = import.meta.env.VITE_RUTA_API;


    useEffect(() => {
        const getPelis = async () => {
            setLoading(true);
            try {
                const { data } = await obtenerPeliculas(page, vistas);
                setPeliculas(data.peliculas);
                setCount(data.totalPaginas);
                setTotalElementos(data.total);
                setLoading(false);
            } catch (error) {
                setLoading(false);
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
            setLoading(false);
            setIdiomas([]);
            toast.info(error.response.data.message)
        }
    }



    const handleUpdate = async (id_pelicula, checked) => {
        try {
            setDesactivar(true);
            await updateDisponibilidad(token, id_pelicula, checked);
            toast.success('Disponibilidad actualizada');
            setDesactivar(false);
            setUpdate(!update);
        } catch (error) {
            toast.error(error.response.data.message);
            setDesactivar(false);
            console.log(error);
        }
    };


    return (
        <Fragment>
            {loading && (<div className="w-full"><LinearProgress /></div>)}
            <div className="text-center m-5 w-full bg-slate-50 rounded-xl">
                <div className="m-5">
                    <h1 className="text-3xl font-bold text-slate-900">Disponibilidad</h1>
                </div>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Titulo</TableCell>
                                <TableCell>Disponibilidad</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>

                        </TableHead>

                        <TableBody>
                            {peliculas.map((pelicula) => (
                                <TableRow key={pelicula.id_pelicula}>
                                    <TableCell>{pelicula.titulo}</TableCell>
                                    <TableCell>{pelicula.disponibilidad}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-row">
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={pelicula.disponibilidad === 1 ? true : false}
                                                        color="success"
                                                        disabled={desactivar}
                                                        onChange={() => handleUpdate(pelicula.id_pelicula, pelicula.disponibilidad === 1 ? false : true)} />
                                                }
                                            />
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

        </Fragment>
    )
}
