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

import { actualizarActor } from "../../../services/actores";
import { subirImagenActor } from "../../../services/updates";

export default function EditActor({ actor, close, update }) {
  const [loading, setLoading] = useState(false);
  const [token] = useState(window.localStorage.getItem("token"));
  const [nombre, setNombre] = useState(actor.nombre);
  const [image, setImage] = useState();

  const url = import.meta.env.VITE_RUTA_API;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (nombre !== actor.nombre) {
        const response = await actualizarActor(token, actor.id_actor, { nombre});
        toast.success(response.data.message);
      }
      if (image) {
        console.log("subiendo imagen");
        const responseImage = await subirImagenActor(token, image, actor.id_actor);
        toast.success(responseImage.message);
      }
      update();
      close();
    }
    catch (error) {
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
        <h1 className="text-center text-2xl font-bold">Editar Actor</h1>
      </div>
      <div className="flex flex-col items-center justify-center m-5">
        <form className="flex flex-col w-full" onSubmit={handleSubmit}>
          <div className="flex flex-row">
            <div className="flex flex-col w-full">
              <TextField
                label="Nombre"
                variant="outlined"
                value={nombre || ""}
                onChange={(e) => setNombre(e.target.value)}
                margin="normal"
                type="text"
              />
            </div>
            <div className="m-5">
              <img
                alt={`${url}/${image}`}
                src={image ? URL.createObjectURL(image) : `${url}/${actor.imagen}`}
                className="w-36 h-36 object-cover"
              />
              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">Fotografia del actor(opcional)</FormLabel>
                <TextField
                  variant="outlined"
                  onChange={(e) => setImage(e.target.files[0])}
                  margin="normal"
                  type="file"
                />
              </FormControl>
            </div>
          </div>

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
