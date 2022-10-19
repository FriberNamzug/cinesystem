import { useState } from "react";
import {
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { crearIdioma } from "../../../services/idiomas";

export default function AddIdioma({ close, update }) {
  const [loading, setLoading] = useState(false);
  const [idioma, setIdioma] = useState("");
  const [token] = useState(window.localStorage.getItem("token"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await crearIdioma(token, { nombre: idioma });
      toast.success("Idioma creado correctamente");
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
        <h1 className="text-center text-2xl font-bold">Agregar Idioma</h1>
      </div>

      <div className="flex flex-col items-center justify-center m-5">
        <form className="flex flex-col w-full" onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            variant="outlined"
            value={idioma || ""}
            onChange={(e) => setIdioma(e.target.value)}
            margin="normal"
          />
          <Button
            className="m-2"
            variant="contained"
            type="submit"
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
