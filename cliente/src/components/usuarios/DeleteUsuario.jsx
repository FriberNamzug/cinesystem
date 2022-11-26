import { useState } from "react";
import {
    TextField,
    Button,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

import { borrarUsuario } from "../../services/usuarios";

export default function DeleteUsuario({ usuario, close, update }) {
    const [loading, setLoading] = useState(false);
    const [token] = useState(localStorage.getItem("token"));

    const handleClick = async () => {
        setLoading(true);
        try {
            await borrarUsuario(token, usuario.id_usuario);
            toast.success("Usuario borrado");
            update();
            close();
        } catch (error) {
            toast.error(error.response.data.message || "Error al borrar usuario");
        }
        setLoading(false);
    }

    return (
        <div className="flex flex-col p-5 border border-black rounded-lg my-5 bg-white ">
            <div className="text-right">
                <CloseIcon
                    onClick={() => close()}
                    className="cursor-pointer text-red-400 hover:text-red-900 "
                />
            </div>

            <div>
                <h1 className="text-center text-2xl font-bold"> Eliminar Usuario</h1>
            </div>
            <div className="flex flex-col items-center justify-center m-5">
                <h2 className="text-center text-2xl font-bold">¿Está seguro que desea eliminar el usuario {usuario.nombre}?</h2>
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
