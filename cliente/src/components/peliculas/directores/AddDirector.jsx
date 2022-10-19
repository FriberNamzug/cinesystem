import { useState } from "react";
import {
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

import { crearDirector } from "../../../services/directores";


export default function AddDirector({ close, update }) {
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [token] = useState(window.localStorage.getItem("token"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await crearDirector(token, { nombre, apellido });
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
        <h1 className="text-center text-2xl font-bold">Agregar Director</h1>
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
            type="submit"
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
