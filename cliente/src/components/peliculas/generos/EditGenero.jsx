import { useState } from "react";
import {
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

import { actualizarGenero } from "../../../services/generos";

export default function EditGenero({ genero, close, update }) {
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState(genero.nombre);
  const [token] = useState(window.localStorage.getItem("token"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await actualizarGenero(token, genero.id_genero, { nombre });
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
        <h1 className="text-center text-2xl font-bold">Editar Género</h1>
      </div>

      <div className="flex flex-col items-center justify-center m-5">
      <form className="flex flex-col w-full" onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            variant="outlined"
            value={nombre || ""}
            onChange={(e) => setNombre(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            type="submit"
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Editar"
            )}
          </Button>
        </form>
      </div>

    </div>
  )
}
