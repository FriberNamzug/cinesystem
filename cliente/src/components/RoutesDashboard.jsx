import { Outlet } from "react-router-dom";
import NavbarDashboard from "./NavbarDashboard";

import Box from "@mui/material/Box";

const RoutesDashboard = () => {
    return (
        <div className="flex flex-row">
            <div className="bg-black h-screen sticky top-0 z-50">
                <NavbarDashboard />
            </div>

            <div className="bg-gradient-to-r from-gray-100 to-gray-300 w-full">
                <div className="mx-5">
                    <Box sx={{ 'user-select': 'none' }}>

                        <Outlet />
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default RoutesDashboard;