import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url';
import cors from 'cors'
import cron from 'node-cron'


import usuariosRoutes from './routes/usuarios.routes.js'
import authRoutes from './routes/auth.routes.js'
import peliculasRoutes from './routes/peliculas.routes.js'
import generosRoutes from './routes/generos.routes.js'
import directoresRoutes from './routes/directores.routes.js'
import actoresRoutes from './routes/actores.routes.js'
import idiomasRoutes from './routes/idiomas.routes.js'
import uploadsRoutes from './routes/uploads.routes.js'
import funcionesRoutes from './routes/funciones.routes.js'
import paymentsRoutes from './routes/payments.routes.js'
import boletosRoutes from './routes/boletos.routes.js'
import rolesRoutes from './routes/roles.routes.js'

import { cleanUsers } from './util/scheduled/clean_disabled_users.js'
import { cleanFunciones } from './util/scheduled/clean_funciones_disables.js'

//import startWhatsapp from './config/whatsapp.js'


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));
app.use(morgan('dev'));

app.use(cors({
    origin: '*'
}));

app.use("/usuarios", usuariosRoutes);
app.use("/auth", authRoutes);
app.use("/peliculas", peliculasRoutes);
app.use("/generos", generosRoutes);
app.use("/directores", directoresRoutes);
app.use("/actores", actoresRoutes);
app.use("/idiomas", idiomasRoutes);
app.use("/uploads", uploadsRoutes);
app.use("/funciones", funcionesRoutes);
app.use("/payments", paymentsRoutes);
app.use("/boletos", boletosRoutes);
app.use("/roles", rolesRoutes);

/* Ejecutamos cada 24 hrs */
cron.schedule('0 0 * * *', () => {
    console.log('Limpiando funciones - ejecucion cada 30 minutos');
    cleanFunciones();
    cleanUsers();

});


cleanFunciones();
cleanUsers();


// Iniciamos el cliente de whatsapp
//startWhatsapp()




app.use((req, res) => {
    res.status(400).json({ message: "Sin permisos para acceder a este recurso" })
})

export default app