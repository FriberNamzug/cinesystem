import { Outlet } from "react-router-dom";
import NavbarDashboard from "./NavbarAdmin";

const RoutesDashboard = () => {
    return (
        <div className="flex flex-row">
            <div className="bg-black h-screen sticky top-0 z-50">
                <NavbarDashboard />
            </div>

            <div className="bg-gradient-to-r from-gray-100 to-gray-300 w-full">
                <div className="mx-5">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default RoutesDashboard;