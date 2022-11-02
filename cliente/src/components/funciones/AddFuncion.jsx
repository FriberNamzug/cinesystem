import { useEffect, useState } from "react";
import {
    TextField,
    Button,
    CircularProgress,
    FormControl,
    FormLabel,
    Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

import { crearFuncion } from "../../services/funciones";
import { buscarPeliculas } from "../../services/peliculas";

export default function AddFuncion({ close, update }) {

    const [loading, setLoading] = useState(false);
    const [peliculas, setPeliculas] = useState([]);
    const [id_pelicula, setId_pelicula] = useState("");
    const [aforo, setAforo] = useState("");
    const [sala, setSala] = useState("");
    const [desde, setDesde] = useState("");
    const [hasta, setHasta] = useState("");
    const [horario, setHorario] = useState("");
    const [token] = useState(window.localStorage.getItem("token"));


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const horario24 = horario.split(" ")[1] === "PM" ? parseInt(horario.split(" ")[0].split(":")[0]) + 12 + ":" + horario.split(" ")[0].split(":")[1] : horario.split(" ")[0];
        const horarioFinal = horario24 + ":00";
        const data = {
            id_pelicula,
            aforo,
            sala,
            fechas: {
                desde,
                hasta,
            },
            horario: horarioFinal
        };
        console.log(data);
        try {
            const response = await crearFuncion(token, data);
            console.log(response);
            toast.success("Funcion creada exitosamente");
            update();
            close();
            setLoading(false);
        } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false);
        }
    }




    const handleSearch = async (e) => {
        if (e.target.value === "") return setPeliculas([]);

        try {
            if (e.target.id === "peliculas") {
                const response = await buscarPeliculas("1", "50", e.target.value);
                setPeliculas(response.data.peliculas);
            }
        } catch (error) {
            console.log(error);
            //toast.error(error.response.data.message || "Error al buscar");
        }
    };


    return (
        <div className="flex flex-col  border border-black rounded-lg bg-white ">
            <div className="text-right">
                <CloseIcon
                    onClick={() => close()}
                    className="cursor-pointer text-red-400 hover:text-red-900 "
                />
            </div>
            <div>
                <h1 className="text-center text-2xl font-bold"> Agregar Funcion</h1>
            </div>
            <div className="flex flex-col items-center justify-center m-5">
                <form className="flex flex-col w-full" onSubmit={handleSubmit}>


                    <div className="flex flex-row ">
                        <Autocomplete
                            id="peliculas"
                            options={peliculas}
                            clearOnEscape
                            getOptionLabel={(option) => option.titulo}
                            style={{
                                width: "100%",
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Pelicula"
                                    margin="normal"
                                    variant="outlined"
                                />
                            )}
                            onChange={(e, value) => setId_pelicula(value.id_pelicula)}
                            onInputChange={handleSearch}
                        />
                    </div>


                    <TextField
                        label="Aforo"
                        variant="outlined"
                        value={aforo || ""}
                        onChange={(e) => setAforo(e.target.value)}
                        margin="normal"
                        type="number"
                    />
                    <TextField
                        label="Sala"
                        variant="outlined"
                        value={sala || ""}
                        onChange={(e) => setSala(e.target.value)}
                        margin="normal"
                        type="number"
                    />

                    <FormControl component="fieldset" margin="normal">
                        <FormLabel component="legend">Horario</FormLabel>
                        <TextField
                            variant="outlined"
                            value={horario || ""}
                            onChange={(e) => setHorario(e.target.value)}
                            type="time"
                        />
                    </FormControl>

                    <FormControl component="fieldset" margin="normal">
                        <FormLabel component="legend">Desde</FormLabel>
                        <TextField
                            variant="outlined"
                            value={desde || ""}
                            onChange={(e) => setDesde(e.target.value)}
                            type="date"
                        />
                    </FormControl>
                    <FormControl component="fieldset" margin="normal">
                        <FormLabel component="legend">Hasta</FormLabel>
                        <TextField
                            variant="outlined"
                            value={hasta || ""}
                            onChange={(e) => setHasta(e.target.value)}
                            type="date"
                        />
                    </FormControl>


                    <Button
                        variant="contained"
                        type="submit"
                        className="mt-5"
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            "Agregar"
                        )}
                    </Button>
                </form>
            </div>
        </div>

    )
}
