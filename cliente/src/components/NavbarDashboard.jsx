import { useState, Fragment } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { Collapse } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import MovieIcon from '@mui/icons-material/Movie';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import PeopleIcon from '@mui/icons-material/People';

import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from "@mui/icons-material/Home";

import { toast } from "react-toastify";

export default function NavbarDashboard() {

    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const style = {
        activate: "block py-2 pr-4 pl-3 text-white bg-gray-700 rounded-lg duration-200",
        disable: "block py-2 pr-4 pl-3 text-white hover:text-gray-200 hover:bg-gray-700 rounded-lg duration-200",
        home: "block py-2 pr-4 pl-3 text-white hover:text-gray-200 hover:bg-gray-700 rounded-lg animate-pulse",
    };

    const handleSignOut = () => {
        localStorage.removeItem("token");
        toast.success("Sesión cerrada");
        navigate("/");
    }

    const Lista = () => {
        return (
            <ul className="flex flex-col justify-between h-screen p-2">
                <div className="flex flex-col items-center">
                    <li className="flex justify-end w-full items-center mb-3">
                        <div className="flex  p-2">
                            <MenuIcon onClick={() => setOpen(!open)} className="cursor-pointer text-white" />
                        </div>
                    </li>

                    <li className="my-2">
                        <NavLink
                            to="./"
                            className={style.home}
                        >
                            <span className="">Inicio</span>
                        </NavLink>
                    </li>



                    <li className="my-2">
                        <NavLink
                            to="./peliculas"
                            className={({ isActive }) => isActive ? style.activate : style.disable}
                        >
                            <span className="">Peliculas</span>
                        </NavLink>
                    </li>

                    <li className="my-2">
                        <NavLink
                            to="./funciones"
                            className={({ isActive }) => isActive ? style.activate : style.disable}
                        >
                            <span className="">Funciones</span>
                        </NavLink>
                    </li>

                    <li className="my-2">
                        <NavLink
                            to="./usuarios"
                            className={({ isActive }) => isActive ? style.activate : style.disable}
                        >
                            <span className="">Usuarios</span>
                        </NavLink>
                    </li>


                    <li className="my-2">
                        <NavLink
                            to="./settings"
                            className={({ isActive }) => isActive ? style.activate : style.disable}
                        >
                            <span className="">Configuración</span>
                        </NavLink>
                    </li>
                </div>
                <div>
                    <li className="cursor-pointer" onClick={handleSignOut}>
                        <span className={style.disable}>Cerrar Sesión</span>
                    </li>
                </div>
            </ul>
        );
    };
    const ListaIcons = () => {
        return (

            <ul className="flex flex-col justify-between h-screen items-center p-1">
                <div>
                    <li className="flex justify-center items-center mb-3">
                        <div className="flex justify-center p-2">
                            <MenuIcon onClick={() => setOpen(!open)} className="cursor-pointer text-white" />
                        </div>
                    </li>

                    <li className="my-2">
                        <NavLink
                            to="./"
                            className={style.home}
                        >
                            <HomeIcon />
                        </NavLink>
                    </li>

                    <li className="my-2">
                        <NavLink
                            to="./peliculas"
                            className={({ isActive }) => isActive ? style.activate : style.disable}
                        >
                            <MovieIcon />
                        </NavLink>
                    </li>

                    <li className="my-2">
                        <NavLink
                            to="./funciones"
                            className={({ isActive }) => isActive ? style.activate : style.disable}
                        >
                            <SlideshowIcon />
                        </NavLink>
                    </li>

                    <li className="my-2">
                        <NavLink
                            to="./usuarios"
                            className={({ isActive }) => isActive ? style.activate : style.disable}
                        >
                            <PeopleIcon />
                        </NavLink>
                    </li>

                    <li className="my-2">
                        <NavLink
                            to="./settings"
                            className={({ isActive }) => isActive ? style.activate : style.disable}
                        >
                            <SettingsIcon />
                        </NavLink>
                    </li>

                </div>

                <div>
                    <li className="cursor-pointer" onClick={handleSignOut}>
                        <span className={style.disable}>
                            <ExitToAppIcon />
                        </span>
                    </li>
                </div>
            </ul>
        );
    };


    return (
        <Fragment>
            <div className="flex flex-col">
                <div className="flex flex-row">
                    <div>
                        <Collapse in={open} orientation="horizontal">
                            <Lista />
                        </Collapse>
                    </div>
                    <div className="text-white">
                        <Collapse in={!open} orientation="horizontal">
                            <ListaIcons />
                        </Collapse>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
