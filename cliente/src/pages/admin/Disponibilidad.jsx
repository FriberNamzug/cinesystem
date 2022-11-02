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
    Switch,
    FormControlLabel
} from "@mui/material";

import { obtenerPeliculas } from "../../services/peliculas";
import { updateDisponibilidad } from "../../services/peliculas";

import { toast } from "react-toastify";
import { styleModal } from "../../components/stylesModal";


export default function Disponibilidad() {

    const [loading, setLoading] = useState(false);
    const [desactivar, setDesactivar] = useState(false);
    const [update, setUpdate] = useState(false);
    const [peliculas, setPeliculas] = useState([]);
    const [pelicula, setPelicula] = useState();
    const [openDisponibilidad, setOpenDisponibilidad] = useState(false);
    const [token, setToken] = useState(window.localStorage.getItem('token'));

    const url = import.meta.env.VITE_RUTA_API;


    useEffect(() => {
        const getPelis = async () => {
            setLoading(true);
            try {
                const { data } = await obtenerPeliculas("1", "50");
                setPeliculas(data.peliculas.filter(peli => peli.disponibilidad === 1));
                setLoading(false);
            } catch (error) {
                setLoading(false);
                toast.info(error.response.data.message)
            }
        }
        getPelis();
    }, [update]);


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
                </TableContainer>
            </div>

        </Fragment>
    )
}
