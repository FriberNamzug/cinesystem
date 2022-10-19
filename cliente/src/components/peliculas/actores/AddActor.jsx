import { useState } from "react";
import {
  TextField,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

import { crearActor } from "../../../services/actores";
import { subirImagenActor } from "../../../services/updates";

export default function AddActor({ close, update }) {
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fecha_nacimiento, setFecha_nacimiento] = useState("");
  const [image, setImage] = useState("");
  const [token] = useState(window.localStorage.getItem("token"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await crearActor(token, { nombre, apellido, fecha_nacimiento });
      toast.success(response.data.message);
      if (image) {
        console.log("subiendo imagen");
        const responseImage = await subirImagenActor(token, image, response.data.actor.id_actor);
        toast.success(responseImage.message);
      }
      update();
      close();
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message || "Error al crear actor");
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
        <h1 className="text-center text-2xl font-bold"> Agregar Actor</h1>
      </div>
      <div className="flex flex-col items-center justify-center m-5">
        <form className="flex flex-col w-full" onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            variant="outlined"
            value={nombre || ""}
            onChange={(e) => setNombre(e.target.value)}
            margin="normal"
            type="text"
          />
          <TextField
            label="Apellido"
            variant="outlined"
            value={apellido || ""}
            onChange={(e) => setApellido(e.target.value)}
            margin="normal"
            type="text"
          />
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Fecha de Nacimiento</FormLabel>
            <TextField
              variant="outlined"
              value={fecha_nacimiento || ""}
              onChange={(e) => setFecha_nacimiento(e.target.value)}
              type="date"
            />
          </FormControl>

          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Fotografia del actor(opcional)</FormLabel>
            <TextField
              variant="outlined"
              onChange={(e) => setImage(e.target.files[0])}
              margin="normal"
              type="file"
            />
          </FormControl>

          <Button
            variant="contained"
            type="submit"
            className="mt-5"
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
