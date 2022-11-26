import { useState, useEffect } from "react";
import {
    TextField,
    Button,
    CircularProgress,
    Select,
    MenuItem,
    InputLabel,
    FormControl,

} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

import { obtenerRoles, editarUsuario } from "../../services/usuarios";


export default function EditUsuario({ usuario, close, update }) {

    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);
    const [user, setUser] = useState({
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.id_rol,
        nombre_rol: usuario.nombre_rol
    });

    const token = localStorage.getItem("token");

    useEffect(() => {
        const getRoles = async () => {
            try {
                const { data } = await obtenerRoles(token);
                setRoles(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setRoles([]);
                toast.info(error.response.data.message)
            }
        }
        getRoles();
    }, []);

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(user)
        setLoading(true);
        try {
            const { data } = await editarUsuario(token, user);
            toast.success(data.message);
            setLoading(false);
            update();
            close();
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message || "Error al editar usuario");
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
            {!loading &&
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold text-slate-900">Editar Usuario</h1>
                    <div className="flex flex-col items-center justify-center w-full p-5">
                        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-full">
                            <TextField
                                label="Nombre"
                                margin="normal"
                                fullWidth
                                name="nombre"
                                value={user.nombre}
                                onChange={handleChange}
                            />

                            <TextField
                                label="Email"
                                margin="normal"
                                fullWidth
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                            />

                            <FormControl fullWidth margin="normal">
                                <InputLabel id="rol">Rol</InputLabel>
                                <Select
                                    labelId="rol"
                                    id="rol"
                                    name="rol"
                                    value={user.rol}
                                    label="Rol"
                                    onChange={handleChange}
                                >
                                    {roles.map((rol) => (
                                        <MenuItem key={rol.id_rol} value={rol.id_rol}>{rol.nombre}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                type="submit"
                                margin="normal"
                            >
                                {loading ? <CircularProgress color="inherit" size={20} /> : "Editar"}
                            </Button>
                        </form>

                    </div>
                </div>}
        </div>

    )
}
