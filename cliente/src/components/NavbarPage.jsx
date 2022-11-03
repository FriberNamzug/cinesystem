import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Collapse } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import LoginIcon from '@mui/icons-material/Login';
import EventSeatIcon from '@mui/icons-material/EventSeat';

import Menu from '@mui/icons-material/Menu';

export default function NavbarPage() {
    const [styles, setStyles] = useState({
        nav: "flex flex-row justify-between bg-black text-white duration-500 px-5 py-2",
        li: "hidden sm:flex  duration-500 mx-1",
        a: 'flex flex-row font-Raleway items-center justify-center hover:bg-gray-300 hover:text-black text-white duration-500 px-5 py-1 rounded-xl text-lg',
        title: 'hidden sm:flex justify-center items-center',
        icon: 'hidden sm:flex justify-center items-center font-bold text-2xl duration-500 mx-2',
        image: "flex sm:hidden md:flex px-5 bg-gray-500 rounded-r-full duration-500 justify-center items-center hover:bg-gray-300 hover:text-black",
    });
    const stylesRef = useRef(styles);

    const [menu, setMenu] = useState(false);
    const [responsive, setResponsive] = useState(true);

    const [permissions, setPermissions] = useState("none");
    const [flag, setFlag] = useState(0);


    useEffect(() => {
        if (localStorage.getItem("permissions") === null) {
            if (flag < 3) {
                setTimeout(() => {
                    setFlag(flag + 1);
                }, 500);
            } else {
                setPermissions("none");
            }
        } else {
            setPermissions(localStorage.getItem("permissions"));
        }
    }, [flag]);

    useEffect(() => {
        if (!responsive) {
            setTimeout(() => {
                setResponsive(true);
            }
                , 5000);
        }
        const handleScroll = () => {
            const position = window.pageYOffset;
            if (position > 0 && menu === false) {
                setMenu(true);
                /* Ponemos transparencia en menu */
                setStyles({
                    ...stylesRef.current,
                    nav: 'flex flex-row justify-between bg-black bg-opacity-50 text-white duration-500',
                    li: 'hidden sm:flex  duration-500 mx-1',
                    image: "flex sm:hidden md:flex px-5 bg-gray-500 bg-opacity-50 rounded-r-full duration-500 justify-center items-center"
                });

            } else if (position === 0) {
                setMenu(false);
                //console.log("Reiniciando estilos")    
                setStyles({
                    ...stylesRef.current
                });
            }
        }
        document.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            document.removeEventListener('scroll', handleScroll);
        }


    }, [menu, responsive]);

    const menuNav = () => {

        return (
            <ul className='flex flex-row w-full justify-end animate__animated animate__fadeInDown'>

                <li className={styles.li}>
                    <Link to='/' className={styles.a}>
                        <span className={styles.title}>Inicio</span>
                        <HomeIcon className={styles.icon} />
                    </Link>
                </li>


                <li className={styles.li}>
                    <Link to='/funciones' className={styles.a}>
                        <span className={styles.title}>Funciones</span>
                        <EventSeatIcon className={styles.icon} />
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link to='/generos' className={styles.a}>
                        <span className={styles.title}>Generos</span>
                        <CategoryIcon className={styles.icon} />
                    </Link>
                </li>

                <li className={styles.li}>
                    <Link to='/login' className={styles.a}>
                        <span className={styles.title}>
                            {permissions === "none" ? "Iniciar Sesión" : "Mi Cuenta"}
                        </span>
                        <LoginIcon className={styles.icon} />
                    </Link>
                </li>

            </ul>
        )
    }


    const menuNavResponsive = () => {

        const style = {
            li: "",
            a: 'flex flex-row font-Raleway items-center justify-center hover:bg-gray-300 text-white hover:text-black duration-500 px-5 py-1 rounded-xl text-lg',
            title: 'justify-center items-center',
            icon: 'items-center font-bold text-2xl duration-500 mx-2',
        }

        return (
            <ul className='flex flex-col w-full justify-end animate__animated animate__fadeInDown'>

                <li className={style.li}>
                    <Link to='/' className={style.a}>
                        <span className={style.title}>Inicio</span>
                        <HomeIcon className={style.icon} />
                    </Link>
                </li>

                <li className={style.li}>
                    <Link to='/category' className={style.a}>
                        <span className={style.title}>Inicia Sesion</span>
                        <LoginIcon className={style.icon} />
                    </Link>
                </li>

                <li className={style.li}>
                    <Link to='/funciones' className={style.a}>
                        <span className={style.title}>Funciones</span>
                        <EventSeatIcon className={style.icon} />
                    </Link>
                </li>
                <li className={style.li}>
                    <Link to='/generos' className={style.a}>
                        <span className={style.title}>Generos</span>
                        <CategoryIcon className={style.icon} />
                    </Link>
                </li>

                <li className={styles.li}>
                    <Link to='/login' className={styles.a}>
                        <span className={styles.title}>Mi cuenta</span>
                        <LoginIcon className={styles.icon} />
                    </Link>
                </li>
            </ul>
        )
    }

    const handleMenu = () => {
        setResponsive(!responsive);
    }

    return (
        <div className={styles.nav}>
            <Link to='/' className={styles.image}>
                <h2 className='text-2xl font-bold font-Raleway'>CineApp</h2>
            </Link>

            <div>
                <div
                    className='flex flex-row justify-end items-center sm:hidden text-lg'
                    onClick={handleMenu}
                >
                    <div
                        className='hover:bg-gray-300 items-center hover:text-black text-white duration-500 px-5 py-1 rounded-xl  cursor-pointer '>
                        <Menu className='flex sm:hidden' />
                    </div>
                </div>
            </div>
            <Collapse in={!responsive} timeout="auto" unmountOnExit orientation='vertical' className='flex flex-row justify-center items-center' >
                {menuNavResponsive()}
            </Collapse>
            <Collapse in={responsive} unmountOnExit orientation='vertical' className='flex flex-row justify-center items-center'>
                {menuNav()}
            </Collapse>
        </div>
    )
}
