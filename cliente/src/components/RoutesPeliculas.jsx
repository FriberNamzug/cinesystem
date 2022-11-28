import { Outlet } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Tabs, Tab, Divider } from '@mui/material';

const RoutesPeliculas = () => {
    return (
        <div className="flex flex-col">
            <div className="">
                <Tabs
                    value={false}
                    indicatorColor="primary"
                    textColor="primary"
                    centered

                >
                    <Tab label="Peliculas" value={1} to="./" component={Link} />
                    <Tab label="Actores" value={2} to="./actores" component={Link} />
                    <Tab label="Directores" value={3} to="./directores" component={Link} />
                    <Tab label="Generos" value={4} to="./generos" component={Link} />
                    <Tab label="Idiomas" value={5} to="./idiomas" component={Link} />
                    <Tab label="Disponibilidad" value={6} to="./disponibilidad" component={Link} />
                </Tabs>
            </div>
            <Divider />
            <div className="bg-gradient-to-r from-gray-100 to-gray-300 w-full">
                <div className="mx-5">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default RoutesPeliculas;