import { useState } from "react";
import {
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

import { eliminarGenero } from "../../../services/generos";

export default function DeleteGenero({ genero, close, update }) {
  const [loading, setLoading] = useState(false);
  const [token] = useState(window.localStorage.getItem("token"));

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await eliminarGenero(token, genero.id_genero);
      toast.success(response.data.message);
      update();
      close();
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
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
        <h1 className="text-center text-2xl font-bold"> Eliminar Genero</h1>
      </div>
      <div className="flex flex-col items-center justify-center m-5">
        <h2 className="text-center text-2xl font-bold">¿Está seguro que desea eliminar el genero {genero.nombre}?</h2>
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
