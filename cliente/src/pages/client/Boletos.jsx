import { useState, useEffect, Fragment, Component } from "react";
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
    Stack,
    Pagination,
    Typography,
} from "@mui/material";

import PreviewIcon from '@mui/icons-material/Preview';
import CloseIcon from "@mui/icons-material/Close";

import { styleModal } from "../../components/stylesModal";
import { toast } from "react-toastify";
import { obtenerBoletos, obtenerBoleto } from "../../services/boletos";

import SelectorPagina from "../../components/tabla/SelectorPagina";


import QRCode from "react-qr-code";


export default function Boletos() {
    const [boletos, setBoletos] = useState([]);
    const [boleto, setBoleto] = useState("");
    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const token = localStorage.getItem("token");

    const [page, setPage] = useState(1);
    const [count, setCount] = useState(5);
    const [totalElementos, setTotalElementos] = useState(0);
    const [vistas, setVistas] = useState(5);

    const handleUpdate = () => setUpdate(!update);


    useEffect(() => {
        const getBoletos = async () => {
            try {
                const { data } = await obtenerBoletos(token, page, vistas);
                console.log(data)
                setCount(data.totalPaginas);
                setTotalElementos(data.total);
                setBoletos(data.boletos);
                setLoading(false);
            } catch (error) {
                toast.error("Error al obtener los boletos");
                console.log(error);
            }
        }
        getBoletos();
    }, [update]);

    const handlePagination = async (event, page) => {
        console.log(page);
        setLoading(true);
        try {
            const { data } = await obtenerBoletos(token, page, vistas);
            setCount(data.totalPaginas);
            setPage(data.pagina);
            setBoletos(data.boletos);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setBoletos([]);
            console.log(error);
            toast.info(error.response.data.message)
        }
    }


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
                                        {boletos.map((boleto) => {
                                            const fecha = new Date(boleto.fecha);
                                            const fechaString = fecha.toLocaleDateString();
                                            return (
                                                <TableRow key={boleto.id_boleto} sx={{ backgroundColor: fecha < new Date() ? "#fff000" : "" }} >                                                   <TableCell>{boleto.id_boleto}</TableCell>
                                                    <TableCell>{boleto.folio}</TableCell>
                                                    <TableCell>{fechaString}</TableCell>
                                                    <TableCell>{boleto.hora}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            startIcon={<PreviewIcon />}
                                                            onClick={() => {
                                                                setOpenModal(true);
                                                                setBoleto(boleto.id_boleto);
                                                            }}
                                                            disabled={fecha < new Date()}
                                                        >
                                                            Ver
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
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
                    </div>
                </div>
            )
            }

            <Modal
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                }}
            >
                <div style={styleModal}>
                    <ShowBoleto boleto={boleto} close={setOpenModal} />
                </div>
            </Modal>


        </Fragment >
    )
}




const ShowBoleto = ({ boleto, close }) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [fecha, setFecha] = useState();
    const token = localStorage.getItem("token");




    useEffect(() => {
        const getBoleto = async () => {
            try {
                const response = await obtenerBoleto(token, boleto);
                setData(response.data);
                console.log(response.data);
                const fecha = new Date(response.data.boleto.fecha);
                setFecha(fecha.toLocaleDateString());
                setLoading(false);
            } catch (error) {
                toast.error("Error al obtener el boleto");
            }
        }
        getBoleto();
    }, [boleto]);

    return (
        <div className="flex flex-col  border border-black rounded-lg bg-white ">

            <div className="text-right">
                <CloseIcon
                    onClick={() => close(false)}
                    className="cursor-pointer text-red-400 hover:text-red-900 "
                />
            </div>
            <div className="flex flex-col items-center">
                {loading && (<div className="flex justify-center items-center"><CircularProgress /></div>)}

                {!loading && (
                    <>

                        <Typography variant="h4" component="h4" >
                            Boleto
                        </Typography>
                        <Typography variant="h6" component="h6" >
                            Folio del boleto: {data.boleto.folio}
                        </Typography>

                        <div className="flex flex-row border border-t-black p-5">
                            <div className="flex flex-col items-center w-full">

                                <Typography variant="h6" component="h6" gutterBottom>
                                    Fecha de la funcion: {fecha}
                                </Typography>
                                <Typography variant="h6" component="h6" gutterBottom>
                                    Hora de la funcion: {data.boleto.hora}
                                </Typography>

                                <Typography variant="h6" component="h6" gutterBottom>
                                    Sala de la funcion: {data.funcion.sala}
                                </Typography>

                                <Typography variant="h6" component="h6" gutterBottom>
                                    Pelicula: {data.pelicula.titulo}
                                </Typography>

                                <Typography variant="h6" component="h6" gutterBottom>
                                    Duracion de la pelicula: {data.pelicula.duracion}
                                </Typography>


                            </div>
                            <div className="flex flex-col items-center w-full">
                                <div style={{ height: "auto", margin: "0 auto", maxWidth: 254, width: "100%" }}>
                                    <QRCode
                                        size={256}
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                        value={data.boleto.security}
                                        viewBox={`0 0 256 256`}
                                    />
                                </div>

                            </div>

                        </div>

                    </>
                )}
            </div>
        </div>
    )
}