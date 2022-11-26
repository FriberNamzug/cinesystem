import { useState } from "react";
import {
    TextField,
    Button,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

import { eliminarPelicula } from "../../../services/peliculas";

export default function DeletePelicula({ pelicula, close, update }) {

    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(window.localStorage.getItem("token"));

    const handleClick = async () => {
        setLoading(true);
        try {
            const { data } = await eliminarPelicula(token, pelicula.id_pelicula);
            toast.success(data.message);
            update();
            close();
            toast.error(message);
        } catch (error) {
            setLoading(false);
            toast.error(error.response.data.message);
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
            <div>
                <h1 className="text-center text-2xl font-bold"> Eliminar Pelicula</h1>
            </div>
            <div className="flex flex-col items-center justify-center m-5">
                <h2 className="text-center text-2xl font-bold">¿Está seguro que desea eliminar la pelicula <span className="font-extrabold">{pelicula.titulo}</span>?</h2>
                <div className="flex flex-row ">
                    <div className="flex flex-col items-center justify-center m-5">
                        <Button
                            variant="contained"
                            onClick={handleClick}
                            disabled={loading}
                            color="error"
                        >
                            {loading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                "Eliminar"
                            )}
                        </Button>
                    </div>
                    <div className="flex flex-col items-center justify-center m-5">

                        <Button
                            variant="contained"
                            onClick={() => close()}
                            disabled={loading}
                            color="success"
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>


            </div>

        </div>
    )
}
