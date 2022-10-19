import { useState } from "react";
import {
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

import { actualizarDirector } from "../../../services/directores";

export default function EditDirector({ director, close, update }) {
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState(director.nombre);
  const [apellido, setApellido] = useState(director.apellido);
  const [token] = useState(window.localStorage.getItem("token"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await actualizarDirector(token, director.id_director, {
        nombre,
        apellido,
      });
      toast.success(response.data.message);
      update();
      close();
    } catch (error) {
      toast.error(error.response.data.message);
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
        <h1 className="text-center text-2xl font-bold">Editar Director</h1>
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
          <TextField
            label="Apellido"
            variant="outlined"
            value={apellido || ""}
            onChange={(e) => setApellido(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Editar"}
          </Button>
        </form>
      </div>


    </div>
  )
}
