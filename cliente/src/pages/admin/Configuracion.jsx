import { useState } from 'react'

import Password from '../../components/configuracion/Password';
import Autenticacion from '../../components/configuracion/Autenticacion';
import Usuario from '../../components/configuracion/Usuario';
import Notificaciones from '../../components/configuracion/Notificaciones';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PasswordIcon from '@mui/icons-material/Password';
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';

import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
export default function Configuracion() {
    const [open, setOpen] = useState(true);
    const [selected, setSelected] = useState();
    const [password, setPassword] = useState(false);
    const [autenticacion, setAutenticacion] = useState(false);
    const [usuario, setUsuario] = useState(false);
    const [notificaciones, setNotificaciones] = useState(false);

    const handleOpen = () => {
        setOpen(true);
        setSelected();
    }

    const handlePassword = () => {
        setSelected('password');
        setPassword(!password);
        setAutenticacion(false);
        setUsuario(false);
        setOpen(false);
        setNotificaciones(false);
        if (password) handleOpen();
    }

    const handleAutenticacion = () => {
        setSelected('autenticacion');
        setAutenticacion(!autenticacion);
        setPassword(false);
        setUsuario(false);
        setOpen(false);
        setNotificaciones(false);
        if (autenticacion) handleOpen();
    }

    const handleUsuario = () => {
        setSelected('usuario');
        setUsuario(!usuario);
        setAutenticacion(false);
        setPassword(false);
        setOpen(false);
        setNotificaciones(false);
        if (usuario) handleOpen();
    }

    const handleNotificaciones = () => {
        setSelected('notificaciones');
        setNotificaciones(!notificaciones);
        setAutenticacion(false);
        setPassword(false);
        setOpen(false);
        setUsuario(false);
        if (notificaciones) handleOpen();
    }


    return (
        <div>
            <h1 className="text-center text-3xl mb-4">Configuraci??n de la cuenta</h1>

            <div className="w-full flex flex-row items-center">

                <div className="flex flex-row w-full">
                    <div className="bg-white p-5 border rounded-lg w-full h-full">
                        <List
                            component="nav"
                        >
                            <ListItem >
                                <ListItemButton
                                    onClick={handleUsuario}
                                    selected={selected === 'usuario'}
                                >
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Usuario" />
                                    {usuario ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
                                </ListItemButton>
                            </ListItem>

                            <ListItem >
                                <ListItemButton
                                    onClick={handleAutenticacion}
                                    selected={selected === 'autenticacion'}
                                >
                                    <ListItemIcon>
                                        <KeyIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Autenticacion" />
                                    {autenticacion ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
                                </ListItemButton>
                            </ListItem>

                            <ListItem >
                                <ListItemButton
                                    onClick={handlePassword}
                                    selected={selected === 'password'}
                                >
                                    <ListItemIcon>
                                        <PasswordIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Password" />
                                    {password ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
                                </ListItemButton>
                            </ListItem>

                            <ListItem >
                                <ListItemButton
                                    onClick={handleNotificaciones}
                                    selected={selected === 'notificaciones'}
                                >
                                    <ListItemIcon>
                                        <NotificationsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Notificaciones" />
                                    {notificaciones ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
                                </ListItemButton>
                            </ListItem>

                        </List>
                    </div>


                    <div className="w-full bg-white p-5 border rounded-lg ml-5">
                        {open &&
                            <div>
                                <p className="text-center text-lg mb-4">Seleccione una opci??n para configurar su cuenta de usuario</p>
                            </div>
                        }
                        {usuario && <Usuario />}
                        {autenticacion && <Autenticacion />}
                        {password && <Password />}
                        {notificaciones && <Notificaciones />}


                    </div>


                </div>







            </div>
        </div>
    )
}
