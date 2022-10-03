import { useState, Fragment } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { Collapse } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CategoryIcon from "@mui/icons-material/Category";
import SegmentIcon from '@mui/icons-material/Segment';
import SettingsIcon from '@mui/icons-material/Settings';
import InventoryIcon from '@mui/icons-material/Inventory';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from "@mui/icons-material/Home";

import { toast } from "react-toastify";

export default function NavbarDashboard() {

    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const style = {
        activate: "block py-2 pr-4 pl-3 text-white bg-gray-700 rounded-lg",
        disable:
            "block py-2 pr-4 pl-3 text-white hover:text-gray-200 hover:bg-gray-700 rounded-lg "
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
                            className={({ isActive }) =>
                                isActive ? style.activate : style.disable
                            }
                        >
                            <span className="">Inicio</span>
                        </NavLink>
                    </li>

                    <li className="my-2">
                        <NavLink
                            to="./categorias"
                            className={({ isActive }) =>
                                isActive ? style.activate : style.disable
                            }
                        >
                            <span className="">Categorias</span>
                        </NavLink>
                    </li>

                    <li className="my-2">
                        <NavLink
                            to="./subcategorias"
                            className={({ isActive }) =>
                                isActive ? style.activate : style.disable
                            }
                        >
                            <span className="">Subcategorias</span>
                        </NavLink>
                    </li>

                    <li className="my-2">
                        <NavLink
                            to="./productos"
                            className={({ isActive }) =>
                                isActive ? style.activate : style.disable
                            }
                        >
                            <span className="">Productos</span>
                        </NavLink>
                    </li>

                    <li className="my-2">
                        <NavLink
                            to="./settings"
                            className={({ isActive }) =>
                                isActive ? style.activate : style.disable
                            }
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

            <ul className="flex flex-col justify-between h-screen items-center p-2">
                <div>
                    <li className="flex justify-center items-center mb-3">
                        <div className="flex justify-center p-2">
                            <MenuIcon onClick={() => setOpen(!open)} className="cursor-pointer text-white" />
                        </div>
                    </li>

                    <li className="my-2">
                        <NavLink
                            to="./"
                            className={({ isActive }) =>
                                isActive ? style.activate : style.disable
                            }
                        >
                            <HomeIcon />
                        </NavLink>
                    </li>

                    <li className="my-2">
                        <NavLink
                            to="./categorias"
                            className={({ isActive }) =>
                                isActive ? style.activate : style.disable
                            }
                        >
                            <CategoryIcon />
                        </NavLink>
                    </li>

                    <li className="my-2">
                        <NavLink
                            to="./subcategorias"
                            className={({ isActive }) =>
                                isActive ? style.activate : style.disable
                            }
                        >
                            <SegmentIcon />
                        </NavLink>
                    </li>

                    <li className="my-2">
                        <NavLink
                            to="./productos"
                            className={({ isActive }) =>
                                isActive ? style.activate : style.disable
                            }
                        >
                            <InventoryIcon />
                        </NavLink>
                    </li>

                    <li className="my-2">
                        <NavLink
                            to="./settings"
                            className={({ isActive }) =>
                                isActive ? style.activate : style.disable
                            }
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
