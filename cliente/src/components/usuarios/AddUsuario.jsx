import { useState, useEffect } from "react";
import {
    TextField,
    Button,
    CircularProgress,
    FormControl,
    FormLabel,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

import { agregarUsuario, obtenerRoles } from "../../services/usuarios";

export default function AddUsuario({ close, update }) {

    const [usuario, setUsuario] = useState({
        nombre: "",
        email: "",
        password: "",
        rol: ""
    });
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState(window.localStorage.getItem("token"));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const getRoles = async () => {
            const { data } = await obtenerRoles(token);
            setRoles(data);
            console.log(data);
        }
        getRoles();
    }, []);

    const handleChange = (e) => {
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await agregarUsuario(token, usuario);
            toast.success(data.message);
            setLoading(false);
            update();
            close();
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message || "Error al agregar usuario");
            setLoading(false);
            setError(true);
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
                <h1 className="text-center text-2xl font-bold">Agregar Usuarios</h1>
            </div>

            <div className="flex flex-col items-center justify-center m-5">
                <form className="flex flex-col w-full" onSubmit={handleSubmit}>
                    <div className="flex flex-col w-full">

                        <TextField
                            label="Nombre"
                            margin="normal"
                            variant="outlined"
                            name="nombre"
                            value={usuario.nombre}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Email"
                            margin="normal"
                            variant="outlined"
                            name="email"
                            value={usuario.email}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Password"
                            type="password"
                            margin="normal"
                            variant="outlined"
                            name="password"
                            value={usuario.password}
                            onChange={handleChange}
                        />

                        <FormControl variant="outlined" margin="normal">
                            <InputLabel id="rol">Rol</InputLabel>
                            <Select
                                labelId="rol"
                                id="rol"
                                value={usuario.rol}
                                onChange={handleChange}
                                label="Rol"
                                name="rol"
                            >
                                <MenuItem value="">
                                    <em>Seleccione un rol</em>
                                </MenuItem>
                                {
                                    roles.map((rol) => (
                                        <MenuItem value={rol.id_rol}>{rol.nombre}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            type="submit"
                            className="self-center mt-5"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : "Agregar"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
