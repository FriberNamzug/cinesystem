import { useState } from "react";
import {
    TextField,
    Button,
    CircularProgress,
    TextareaAutosize,
    FormControl,
    FormLabel,
    Autocomplete,
    Chip,
    Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

import { crearPelicula } from "../../../services/peliculas";
import { buscarIdiomas, crearIdioma } from "../../../services/idiomas";
import { buscarGeneros, crearGenero } from "../../../services/generos";
import { buscarActores, crearActor } from "../../../services/actores";
import { buscarDirectores, crearDirector } from "../../../services/directores";

export default function AddPelicula({ close, update }) {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(window.localStorage.getItem("token"));
    const [pelicula, setPelicula] = useState({
        titulo: "",
        sinopsis: "",
        fecha_estreno: "",
        duracion: "",
        disponibilidad: "",
        idiomas: [],
        generos: [],
        actores: [],
        directores: [],
    });
    const [idiomas, setIdiomas] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [actores, setActores] = useState([]);
    const [directores, setDirectores] = useState([]);

    const handleChange = (e) => {
        setPelicula({
            ...pelicula,
            [e.target.name]: e.target.value,
        });
    };

    const handleSearch = async (e) => {
        if (e.target.value === "") return setIdiomas([]);

        try {
            if (e.target.id === "idiomas") {
                const response = await buscarIdiomas("1", "50", e.target.value);
                setIdiomas(response.data.idiomas);
            } else if (e.target.id === "generos") {
                const response = await buscarGeneros("1", "50", e.target.value);
                setGeneros(response.data.generos);
            } else if (e.target.id === "actores") {
                const response = await buscarActores("1", "50", e.target.value);
                setActores(response.data.actores);
            } else if (e.target.id === "directores") {
                const response = await buscarDirectores("1", "50", e.target.value);
                setDirectores(response.data.directores);
            }
        } catch (error) {
            if (e.target.id === "idiomas") {
                setIdiomas([
                    {
                        nombre: e.target.value,
                        id_idioma: "i" + Math.floor(Math.random() * 1000000),
                    },
                ]);
            } else if (e.target.id === "generos") {
                setGeneros([
                    {
                        nombre: e.target.value,
                        id_genero: "i" + Math.floor(Math.random() * 1000000),
                    },
                ]);
            } else if (e.target.id === "actores") {
                setActores([
                    {
                        nombre: e.target.value,
                        id_actor: "i" + Math.floor(Math.random() * 1000000),
                    },
                ]);
            } else if (e.target.id === "directores") {
                setDirectores([
                    {
                        nombre: e.target.value,
                        id_director: "i" + Math.floor(Math.random() * 1000000),
                    },
                ]);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(pelicula);

        //Creacion de las propiedades de la pelicula
        for (let i = 0; i < pelicula.idiomas.length; i++) {
            if (isNaN(pelicula.idiomas[i].id_idioma)) {
                try {
                    const response = await crearIdioma(token, { nombre: pelicula.idiomas[i].nombre });
                    pelicula.idiomas[i].id_idioma = response.data.idioma.id_idioma;
                } catch (error) {
                    console.log(error);
                }
            }
        }
        for (let i = 0; i < pelicula.generos.length; i++) {
            if (isNaN(pelicula.generos[i].id_genero)) {
                try {
                    const response = await crearGenero(token, { nombre: pelicula.generos[i].nombre });
                    pelicula.generos[i].id_genero = response.data.genero.id_genero;
                } catch (error) {
                    console.log(error);
                }
            }
        }
        for (let i = 0; i < pelicula.actores.length; i++) {
            if (isNaN(pelicula.actores[i].id_actor)) {
                try {
                    const response = await crearActor(token, { nombre: pelicula.actores[i].nombre, apellido: " ", fecha_nacimiento: "2000-01-01" });
                    pelicula.actores[i].id_actor = response.data.actor.id_actor;
                } catch (error) {
                    console.log(error);
                }
            }
        }
        for (let i = 0; i < pelicula.directores.length; i++) {
            if (isNaN(pelicula.directores[i].id_director)) {
                try {
                    const response = await crearDirector(token, { nombre: pelicula.directores[i].nombre, apellido: " " });
                    pelicula.directores[i].id_director = response.data.director.id_director;
                } catch (error) {
                    console.log(error);
                }
            }
        }

        //Creacion de la pelicula
        try {
            await crearPelicula(token, {
                titulo: pelicula.titulo,
                sinopsis: pelicula.sinopsis,
                fecha_estreno: pelicula.fecha_estreno,
                duracion: pelicula.duracion,
                disponibilidad: true,
                idiomas: pelicula.idiomas.map((idioma) => idioma.id_idioma),
                generos: pelicula.generos.map((genero) => genero.id_genero),
                actores: pelicula.actores.map((actor) => actor.id_actor),
                directores: pelicula.directores.map((director) => director.id_director),
            });
            setLoading(false);
            toast.success("Pelicula creada con exito");


        } catch (error) {
            console.log(error);
            setLoading(false);
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
                <h1 className="text-center text-2xl font-bold"> Agregar Pelicula</h1>
            </div>

            <div className="flex flex-col items-center justify-center m-5">
                <form className="flex flex-col w-full" onSubmit={handleSubmit}>
                    <div className="flex flex-col w-full">
                        <TextField
                            label="Titulo"
                            margin="normal"
                            variant="outlined"
                            name="titulo"
                            value={pelicula.titulo}
                            onChange={handleChange}
                            type="text"
                            required
                        />
                        <FormControl variant="outlined" margin="normal">
                            <FormLabel>Sinopsis</FormLabel>
                            <TextareaAutosize
                                minRows={2}
                                maxRows={4}
                                name="sinopsis"
                                value={pelicula.sinopsis}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #ced4da",
                                    borderRadius: "5px",
                                }}
                                required
                            />
                        </FormControl>
                        <FormControl variant="outlined" margin="normal">
                            <FormLabel>Fechas de Estreno</FormLabel>
                            <TextField
                                variant="outlined"
                                name="fecha_estreno"
                                value={pelicula.fecha_estreno}
                                onChange={handleChange}
                                type="date"
                                required
                            />
                        </FormControl>
                        <TextField
                            label="Duracion"
                            margin="normal"
                            variant="outlined"
                            name="duracion"
                            value={pelicula.duracion}
                            onChange={handleChange}
                            type="number"
                            required
                        />
                        <TextField
                            label="Disponibilidad"
                            margin="normal"
                            variant="outlined"
                            name="disponibilidad"
                            value={pelicula.disponibilidad}
                            onChange={handleChange}
                            type="number"
                            required
                        />

                        {/* Aqui ira un pequeño buscador que podra buscar los idiomas y añadirlos a una lista */}
                        <div className="flex flex-row ">
                            <div className="w-96 flex flex-row">
                                <Autocomplete
                                    id="idiomas"
                                    options={idiomas}
                                    clearOnEscape
                                    getOptionLabel={(option) => option.nombre}
                                    style={{ width: 300 }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Idiomas"
                                            margin="normal"
                                            variant="outlined"
                                        />
                                    )}
                                    onChange={(e, value) => {
                                        if (value !== null) {
                                            if (
                                                pelicula.idiomas.find(
                                                    (idioma) => idioma.id_idioma === value.id_idioma
                                                )
                                            ) {
                                                toast.error("El idioma ya esta en la lista");
                                                return;
                                            }
                                            setPelicula({
                                                ...pelicula,
                                                idiomas: [...pelicula.idiomas, value],
                                            });
                                        }
                                    }}
                                    onInputChange={handleSearch}
                                />
                            </div>
                            <div className="flex flex-row flex-wrap items-center w-full bg-slate-200 rounded-xl m-2">
                                {pelicula.idiomas.map((i) => (
                                    <div className="m-2">
                                        <Chip
                                            key={i.id_idioma}
                                            label={i.nombre}
                                            color="primary"
                                            onDelete={() => {
                                                setPelicula({
                                                    ...pelicula,
                                                    idiomas: pelicula.idiomas.filter(
                                                        (idioma) => idioma.id_idioma !== i.id_idioma
                                                    ),
                                                });
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Aqui ira un pequeño buscador que podra buscar los idiomas y añadirlos a una lista */}
                        <div className="flex flex-row">
                            <div className="w-96">
                                <Autocomplete
                                    id="generos"
                                    options={generos}
                                    clearOnEscape
                                    getOptionLabel={(option) => option.nombre}
                                    style={{ width: 300 }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Generos"
                                            margin="normal"
                                            variant="outlined"
                                        />
                                    )}
                                    onChange={(e, value) => {
                                        if (value !== null) {
                                            if (
                                                pelicula.generos.find(
                                                    (generos) => generos.id_genero === value.id_genero
                                                )
                                            ) {
                                                toast.error("El genero ya esta en la lista");
                                                return;
                                            }
                                            setPelicula({
                                                ...pelicula,
                                                generos: [...pelicula.generos, value],
                                            });
                                        }
                                    }}
                                    onInputChange={handleSearch}
                                />
                            </div>
                            <div className="flex flex-row flex-wrap items-center w-full bg-slate-200 rounded-xl m-2">
                                {pelicula.generos.map((i) => (
                                    <div className="m-2">
                                        <Chip
                                            key={i.id_genero}
                                            label={i.nombre}
                                            color="secondary"
                                            onDelete={() => {
                                                setPelicula({
                                                    ...pelicula,
                                                    generos: pelicula.generos.filter(
                                                        (genero) => genero.id_genero !== i.id_genero
                                                    ),
                                                });
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Aqui ira un pequeño buscador que podra buscar los idiomas y añadirlos a una lista */}
                        <div className="flex flex-row">
                            <div className="w-96">
                                <Autocomplete
                                    id="actores"
                                    options={actores}
                                    clearOnEscape
                                    getOptionLabel={(option) => option.nombre}
                                    style={{ width: 300 }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Actores"
                                            margin="normal"
                                            variant="outlined"
                                        />
                                    )}
                                    onChange={(e, value) => {
                                        if (value !== null) {
                                            if (
                                                pelicula.actores.find(
                                                    (actores) => actores.id_actor === value.id_actor
                                                )
                                            ) {
                                                toast.error("El actor ya esta en la lista");
                                                return;
                                            }
                                            setPelicula({
                                                ...pelicula,
                                                actores: [...pelicula.actores, value],
                                            });
                                        }
                                    }}
                                    onInputChange={handleSearch}
                                />
                            </div>
                            <div className="flex flex-row flex-wrap items-center w-full bg-slate-200 rounded-xl m-2">
                                {pelicula.actores.map((i) => (
                                    <div className="m-2">
                                        <Chip
                                            key={i.id_actor}
                                            label={i.nombre}
                                            color="secondary"
                                            onDelete={() => {
                                                setPelicula({
                                                    ...pelicula,
                                                    actores: pelicula.actores.filter(
                                                        (actor) => actor.id_actor !== i.id_actor
                                                    ),
                                                });
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Aqui ira un pequeño buscador que podra buscar los idiomas y añadirlos a una lista */}
                        <div className="flex flex-row">
                            <div className="w-96">
                                <Autocomplete
                                    id="directores"
                                    options={directores}
                                    clearOnEscape
                                    getOptionLabel={(option) => option.nombre}
                                    style={{ width: 300 }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Directores"
                                            margin="normal"
                                            variant="outlined"
                                        />
                                    )}
                                    onChange={(e, value) => {
                                        if (value !== null) {
                                            if (
                                                pelicula.directores.find(
                                                    (directores) =>
                                                        directores.id_director === value.id_director
                                                )
                                            ) {
                                                toast.error("El director ya esta en la lista");
                                                return;
                                            }
                                            setPelicula({
                                                ...pelicula,
                                                directores: [...pelicula.directores, value],
                                            });
                                        }
                                    }}
                                    onInputChange={handleSearch}
                                />
                            </div>
                            <div className="flex flex-row flex-wrap items-center w-full bg-slate-200 rounded-xl m-2">
                                {pelicula.directores.map((i) => (
                                    <div className="m-2">
                                        <Chip
                                            key={i.id_director}
                                            label={i.nombre}
                                            color="secondary"
                                            onDelete={() => {
                                                setPelicula({
                                                    ...pelicula,
                                                    directores: pelicula.directores.filter(
                                                        (director) => director.id_director !== i.id_director
                                                    ),
                                                });
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row justify-center">
                        <Button variant="outlined" color="primary" type="submit" fullWidth>
                            {loading ? <CircularProgress color="success" /> : "Guardar"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
