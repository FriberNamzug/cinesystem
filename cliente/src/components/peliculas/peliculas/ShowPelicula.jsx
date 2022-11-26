import { useState, useEffect } from "react";
import {
    TextField,
    Button,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

import { obtenerPelicula } from "../../../services/peliculas";
import { subirImagenPelicula } from "../../../services/updates";

export default function ShowPelicula({ pelicula, close, update }) {

    const [loading, setLoading] = useState(true);
    const [peliculaData, setPeliculaData] = useState({});
    const [token] = useState(localStorage.getItem("token"));
    const url = import.meta.env.VITE_RUTA_API;

    useEffect(() => {
        const getPelicula = async () => {
            try {
                const { data } = await obtenerPelicula(pelicula.id_pelicula);
                setPeliculaData(data);
                //console.log(data)
                setLoading(false);
            } catch (error) {
                toast.error(error);
                console.log(error);
            }
        }
        getPelicula();
    }, [pelicula]);

    const handleImagen = async (e) => {
        try {
            setLoading(true);
            await subirImagenPelicula(token, e.target.files[0], pelicula.id_pelicula,);
            //Si no se presentaron errores entonces se actualiza la imagen
            setPeliculaData({
                ...peliculaData,
                imagen: {
                    default: true,
                    url: URL.createObjectURL(e.target.files[0]),
                }
            });
            update()
            toast.success("Imagen actualizada");
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error(error.response.data.error || error.message);
        }



    }

    return (
        <div className="flex flex-col  border border-black rounded-lg bg-white ">
            <div className="text-right">
                <CloseIcon
                    onClick={() => close()}
                    className="cursor-pointer text-red-400 hover:text-red-900 "
                />
            </div>

            {loading && (<div className="flex justify-center items-center h-screen"><CircularProgress /></div>)}

            {!loading &&
                <div className="flex flex-row justify-around items-center">

                    <div className="flex flex-col p-5 w-full">
                        <img
                            src={peliculaData.imagen.default ? `${peliculaData.imagen.url}` : `${url}/${peliculaData.imagen.url}`}
                            alt={peliculaData.titulo}
                            className="w-96" />
                        <Button
                            variant="contained"
                            component="label"
                            className="mt-2 w-96"

                        >
                            Cambiar imagen
                            <input
                                type="file"
                                hidden
                                onChange={handleImagen}
                            />
                        </Button>
                    </div>


                    <div className="flex flex-col items-center justify-center p-5">
                        <p>
                            <span className="font-bold">Titulo:  </span>
                            {peliculaData.titulo}
                        </p>
                        <p>
                            <span className="font-bold">Fecha de estreno:  </span>
                            {new Date(peliculaData.fecha_estreno).toLocaleDateString()}
                        </p>
                        <p>
                            <span className="font-bold">Duracion:  </span>
                            {peliculaData.duracion} Minutos
                        </p>
                        <p>
                            <span className="font-bold">Sinopsis:  </span>
                            {peliculaData.sinopsis}
                        </p>
                        <p>
                            <span className="font-bold">Generos:  </span>

                            {peliculaData.generos.length == 0 ? "No hay generos" : peliculaData.generos.map((genero) => genero.nombre).join(", ")}
                        </p>
                        <p>
                            <span className="font-bold">Actores:  </span>
                            {peliculaData.actores.length == 0 ? "No hay actores" : peliculaData.actores.map((actor) => actor.nombre).join(", ")}
                        </p>
                        <p>
                            <span className="font-bold">Directores:  </span>
                            {peliculaData.directores.length == 0 ? "No hay directores" : peliculaData.directores.map((director) => director.nombre).join(", ")}
                        </p>
                        <p>
                            <span className="font-bold">Idiomas:  </span>
                            {peliculaData.idiomas.length == 0 ? "No hay idiomas" : peliculaData.idiomas.map((idioma) => idioma.nombre).join(", ")}
                        </p>


                    </div>
                </div>
            }
        </div>
    )
}
