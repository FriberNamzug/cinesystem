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

import PreviewIcon from '@mui/icons-material/Preview';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import AddActor from "../../components/peliculas/actores/AddActor";
import EditActor from "../../components/peliculas/actores/EditActor";
import DeleteActor from "../../components/peliculas/actores/DeleteActor";
import ShowActor from "../../components/peliculas/actores/ShowActor";
import { styleModal } from "../../components/stylesModal";

import { toast } from "react-toastify";

import { obtenerBoletos } from "../../services/boletos";

export default function Boletos() {
    const [boletos, setBoletos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const getBoletos = async () => {
            try {
                const { data } = await obtenerBoletos(token, "1", "50");
                setBoletos(data);
                setLoading(false);
                console.log(data);
            } catch (error) {
                toast.error("Error al obtener los boletos");
            }
        }
        getBoletos();
    }, []);


    return (
        <Fragment>
            {loading && (<div className="flex justify-center items-center h-screen"><CircularProgress /></div>)}


            {!loading && (
                <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-bold">Boletos</h1>
                        <div className="flex flex-col items-center bg-white rounded-md shadow-md">
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Folio</TableCell>
                                            <TableCell>Fecha</TableCell>
                                            <TableCell>Hora</TableCell>
                                            <TableCell>Mas informacion</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {boletos.boletos.map((boleto) => (
                                            <TableRow key={boleto.id_boleto}>
                                                <TableCell>{boleto.id_boleto}</TableCell>
                                                <TableCell>{boleto.folio}</TableCell>
                                                <TableCell>{boleto.fecha}</TableCell>
                                                <TableCell>{boleto.hora}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<PreviewIcon />}
                                                        onClick={() => {
                                                            setOpenModal(true);
                                                        }}
                                                    >
                                                        Ver
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </div>
            )}

        </Fragment>
    )
}
