import { useState, useEffect, Fragment } from "react";
import {
    TextField,
    Button,
    CircularProgress,
    FormControl,
    FormLabel,
    TextareaAutosize,
    Autocomplete,
    Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

import { obtenerPelicula, actualizarPelicula } from "../../../services/peliculas";
import { buscarIdiomas, crearIdioma } from "../../../services/idiomas";
import { buscarGeneros, crearGenero } from "../../../services/generos";
import { buscarActores, crearActor } from "../../../services/actores";
import { buscarDirectores, crearDirector } from "../../../services/directores";


export default function EditPelicula({ pelicula, close, update }) {
    const [loading, setLoading] = useState(true);
    const [peliculaData, setPeliculaData] = useState();
    const [token] = useState(localStorage.getItem("token"));

    const [idiomas, setIdiomas] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [actores, setActores] = useState([]);
    const [directores, setDirectores] = useState([]);

    useEffect(() => {
        const getPelicula = async () => {
            try {
                setLoading(true);
                const { data } = await obtenerPelicula(pelicula.id_pelicula, token);
                setPeliculaData(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        }
        getPelicula();
    }, [pelicula]);

    const handleChange = (e) => {
        setPeliculaData({
            ...peliculaData,
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
        console.log(peliculaData);

        //Creacion de las propiedades de la pelicula
        for (let i = 0; i < peliculaData.idiomas.length; i++) {
            if (isNaN(peliculaData.idiomas[i].id_idioma)) {
                try {
                    const response = await crearIdioma(token, { nombre: peliculaData.idiomas[i].nombre });
                    peliculaData.idiomas[i].id_idioma = response.data.idioma.id_idioma;
                } catch (error) {
                    console.log(error);
                }
            }
        }
        for (let i = 0; i < peliculaData.generos.length; i++) {
            if (isNaN(peliculaData.generos[i].id_genero)) {
                try {
                    const response = await crearGenero(token, { nombre: peliculaData.generos[i].nombre });
                    peliculaData.generos[i].id_genero = response.data.genero.id_genero;
                } catch (error) {
                    console.log(error);
                }
            }
        }
        for (let i = 0; i < peliculaData.actores.length; i++) {
            if (isNaN(peliculaData.actores[i].id_actor)) {
                try {
                    const response = await crearActor(token, { nombre: peliculaData.actores[i].nombre, apellido: " ", fecha_nacimiento: "2000-01-01" });
                    peliculaData.actores[i].id_actor = response.data.actor.id_actor;
                } catch (error) {
                    console.log(error);
                }
            }
        }
        for (let i = 0; i < peliculaData.directores.length; i++) {
            if (isNaN(peliculaData.directores[i].id_director)) {
                try {
                    const response = await crearDirector(token, { nombre: peliculaData.directores[i].nombre, apellido: " " });
                    peliculaData.directores[i].id_director = response.data.director.id_director;
                } catch (error) {
                    console.log(error);
                }
            }
        }

        try {
            const data = {
                titulo: peliculaData.titulo,
                sinopsis: peliculaData.sinopsis,
                fecha_estreno: peliculaData.fecha_estreno,
                duracion: peliculaData.duracion,
                disponibilidad: true,
                idiomas: peliculaData.idiomas.map((idioma) => idioma.id_idioma),
                generos: peliculaData.generos.map((genero) => genero.id_genero),
                actores: peliculaData.actores.map((actor) => actor.id_actor),
                directores: peliculaData.directores.map((director) => director.id_director),
            }

            await actualizarPelicula(token, pelicula.id_pelicula, data);
            setLoading(false);
            toast.success("Pelicula actualizada correctamente");
            update();
            close();

        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error("Error al editar la pelicula");
        }
    }

    return (
        <Fragment>
            <div className="flex flex-col  border border-black rounded-lg bg-white ">
                {loading && (<div className="flex justify-center items-center h-screen"><CircularProgress /></div>)}

                <div className="text-right">
                    <CloseIcon
                        onClick={() => close()}
                        className="cursor-pointer text-red-400 hover:text-red-900 "
                    />
                </div>

                {!loading &&
                    <div className="flex flex-col items-center">

                        <div className="flex flex-col items-center">
                            <h1 className="text-2xl font-bold">Editar Pelicula</h1>
                        </div>
                        <form className="flex flex-col w-full p-5" onSubmit={handleSubmit}>
                            <TextField
                                label="Titulo"
                                margin="normal"
                                variant="outlined"
                                name="titulo"
                                value={peliculaData.titulo}
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
                                    value={peliculaData.sinopsis}
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
                                    value={(() => {
                                        try {
                                            const f = new Date(peliculaData.fecha_estreno).toISOString().slice(0, 10)
                                            console.log(f)
                                            return f
                                        } catch (error) {
                                            return "0000-00-00"
                                        }
                                    })()}
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
                                value={peliculaData.duracion}
                                onChange={handleChange}
                                type="number"
                                required
                            />
                            <TextField
                                label="La disponibilidad se cambia en su respectiva seccion"
                                margin="normal"
                                variant="standard"
                                name="disponibilidad"
                                value={peliculaData.disponibilidad === 1 ? "Disponible" : "No Disponible"}
                                onChange={handleChange}
                                disabled
                            />




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
                                                    peliculaData.idiomas.find(
                                                        (idioma) => idioma.id_idioma === value.id_idioma
                                                    )
                                                ) {
                                                    toast.error("El idioma ya esta en la lista");
                                                    return;
                                                }
                                                setPeliculaData({
                                                    ...peliculaData,
                                                    idiomas: [...peliculaData.idiomas, value],
                                                });
                                            }
                                        }}
                                        onInputChange={handleSearch}
                                    />
                                </div>
                                <div className="flex flex-row flex-wrap items-center w-full bg-slate-200 rounded-xl m-2">
                                    {peliculaData.idiomas.map((i) => (
                                        <div className="m-2">
                                            <Chip
                                                key={i.id_idioma}
                                                label={i.nombre}
                                                color="primary"
                                                onDelete={() => {
                                                    setPeliculaData({
                                                        ...peliculaData,
                                                        idiomas: peliculaData.idiomas.filter(
                                                            (idioma) => idioma.id_idioma !== i.id_idioma
                                                        ),
                                                    });
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>


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
                                                    peliculaData.generos.find(
                                                        (generos) => generos.id_genero === value.id_genero
                                                    )
                                                ) {
                                                    toast.error("El genero ya esta en la lista");
                                                    return;
                                                }
                                                setPeliculaData({
                                                    ...peliculaData,
                                                    generos: [...peliculaData.generos, value],
                                                });
                                            }
                                        }}
                                        onInputChange={handleSearch}
                                    />
                                </div>
                                <div className="flex flex-row flex-wrap items-center w-full bg-slate-200 rounded-xl m-2">
                                    {peliculaData.generos.map((i) => (
                                        <div className="m-2">
                                            <Chip
                                                key={i.id_genero}
                                                label={i.nombre}
                                                color="secondary"
                                                onDelete={() => {
                                                    setPeliculaData({
                                                        ...peliculaData,
                                                        generos: peliculaData.generos.filter(
                                                            (genero) => genero.id_genero !== i.id_genero
                                                        ),
                                                    });
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

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
                                                    peliculaData.actores.find(
                                                        (actores) => actores.id_actor === value.id_actor
                                                    )
                                                ) {
                                                    toast.error("El actor ya esta en la lista");
                                                    return;
                                                }
                                                setPeliculaData({
                                                    ...peliculaData,
                                                    actores: [...peliculaData.actores, value],
                                                });
                                            }
                                        }}
                                        onInputChange={handleSearch}
                                    />
                                </div>
                                <div className="flex flex-row flex-wrap items-center w-full bg-slate-200 rounded-xl m-2">
                                    {peliculaData.actores.map((i) => (
                                        <div className="m-2">
                                            <Chip
                                                key={i.id_actor}
                                                label={i.nombre}
                                                color="secondary"
                                                onDelete={() => {
                                                    setPeliculaData({
                                                        ...peliculaData,
                                                        actores: peliculaData.actores.filter(
                                                            (actor) => actor.id_actor !== i.id_actor
                                                        ),
                                                    });
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

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
                                                    peliculaData.directores.find(
                                                        (directores) =>
                                                            directores.id_director === value.id_director
                                                    )
                                                ) {
                                                    toast.error("El director ya esta en la lista");
                                                    return;
                                                }
                                                setPeliculaData({
                                                    ...peliculaData,
                                                    directores: [...peliculaData.directores, value],
                                                });
                                            }
                                        }}
                                        onInputChange={handleSearch}
                                    />
                                </div>
                                <div className="flex flex-row flex-wrap items-center w-full bg-slate-200 rounded-xl m-2">
                                    {peliculaData.directores.map((i) => (
                                        <div className="m-2">
                                            <Chip
                                                key={i.id_director}
                                                label={i.nombre}
                                                color="secondary"
                                                onDelete={() => {
                                                    setPeliculaData({
                                                        ...peliculaData,
                                                        directores: peliculaData.directores.filter(
                                                            (director) => director.id_director !== i.id_director
                                                        ),
                                                    });
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>




                            <Button
                                variant="contained"
                                className="my-2"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (<CircularProgress size={20} color="inherit" />) : ("Editar")}
                            </Button>



                        </form>
                    </div>}
            </div>
        </Fragment>
    )
}
