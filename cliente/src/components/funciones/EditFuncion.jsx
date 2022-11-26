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

import { actualizarFuncion } from "../../services/funciones";

export default function EditFuncion({ funcion, update, close }) {

  const [loading, setLoading] = useState(false);
  const [funcionEdit, setFuncionEdit] = useState(funcion);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFuncionEdit({ ...funcionEdit, [e.target.name]: e.target.value });
  }
  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const horario24 = funcionEdit.horario.split(" ")[1] === "PM" ? parseInt(funcionEdit.horario.split(" ")[0].split(":")[0]) + 12 + ":" + funcionEdit.horario.split(" ")[0].split(":")[1] : funcionEdit.horario.split(" ")[0];
      const horarioFinal = horario24 + ":00";
      await actualizarFuncion(token, funcionEdit.id_funcion, {
        sala: funcionEdit.sala,
        fechas: {
          desde: funcionEdit.desde,
          hasta: funcionEdit.hasta,
        },
        horario: horarioFinal
      });
      toast.success("Funcion editada correctamente");
      update();
      close();
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message || "Error al editar la funcion");
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
        <h1 className="text-center text-2xl font-bold"> Agregar Funcion</h1>
      </div>
      <div className="flex flex-col items-center justify-center m-5">
        <form onSubmit={handleEdit} className="flex flex-col w-full">
          <TextField
            label="Pelicula"
            name="pelicula"
            value={funcionEdit.titulo}
            margin="normal"
            fullWidth
            disabled
          />
          <TextField
            label="Aforo"
            name="aforo"
            value={funcionEdit.aforo}
            margin="normal"
            fullWidth
            disabled
          />
          <TextField
            label="Sala"
            name="sala"
            value={funcionEdit.sala}
            margin="normal"
            fullWidth
            type="number"
            onChange={handleChange}
          />

          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Horario</FormLabel>
            <TextField
              label="Horario"
              name="horario"
              value={funcionEdit.horario}
              margin="normal"
              type="time"
              onChange={handleChange}
            />
          </FormControl>

          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Desde</FormLabel>
            <TextField
              name="desde"
              value={new Date(funcionEdit.desde).toISOString().slice(0, 10)}
              margin="normal"
              type="date"
              onChange={handleChange}
            />
          </FormControl>

          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Hasta</FormLabel>
            <TextField
              name="hasta"
              value={new Date(funcionEdit.hasta).toISOString().slice(0, 10)}
              margin="normal"
              type="date"
              onChange={handleChange}
            />
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            margin="normal"
            disabled={loading}
            type="submit"
          >
            {loading && <CircularProgress size={20} />}
            {!loading && "Editar"}
          </Button>
        </form>
      </div>
    </div >
  )
}
