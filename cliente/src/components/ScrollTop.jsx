import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as Scroll from 'react-scroll';


import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export default function ScrollTop() {
    const [visible, setVisible] = useState(false);
    const { pathname } = useLocation();

//Este useEffect nos reinicia el scroll a la parte superior de la página cuando cambiamos de ruta
    useEffect(() => {
        const canControlScrollRestoration = 'scrollRestoration' in window.history
        if (canControlScrollRestoration) {
            window.history.scrollRestoration = 'manual';
        }

        window.scrollTo(0, 0);
    }, [pathname]);



    const toggleVisible = () => {
        if (
            document.body.scrollTop > 250 ||
            document.documentElement.scrollTop > 250
        ) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisible, false);
        return () => {
            window.removeEventListener("scroll", toggleVisible, false);
        }
    }, []);

    const handleScroll = () => {
        Scroll.animateScroll.scrollToTop();
    };


    return (
        <div id="back-to-top"
            onClick={handleScroll}
            title="Subir"
            style={{ display: visible ? "block" : "none" }}
            className="fixed bottom-5 right-5 bg-yellow-600 hover:bg-yellow-800 duration-500 text-white text-lg px-5 py-2 rounded-xl cursor-pointer z-50"
        >
            <ArrowUpwardIcon />
        </div>
    );
};