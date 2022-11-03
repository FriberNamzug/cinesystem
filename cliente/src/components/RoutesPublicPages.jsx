
import { Outlet } from "react-router-dom";
import { Box } from '@mui/material';

import NavbarPage from '../components/NavbarPage'

import bgPage from '../assets/bg-page.jpg'



export default function RoutesPublicPages() {
    return (
        <div>
            <img src={bgPage} alt="bgLogin" style={{ width: "100%", height: "100%", position: "fixed", zIndex: "-1" }} />
            <Box sx={{ 'user-select': 'none' }}>
                <div className="sticky top-0 z-50">
                    <NavbarPage />
                </div>
            </Box>


            <Box sx={{ 'user-select': 'none' }}>
                <Outlet />
            </Box>

        </div>
    )
}
