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

import { cleanUsers } from './util/scheduled/clean_disabled_users.js'

import startWhatsapp from './config/whatsapp.js'


const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




app.use(express.json())
app.use(express.static(path.join(__dirname, './public')))
app.use(morgan('dev'))

app.use(cors({
    origin: ['http://localhost:3000', 'http://192.168.100.40:3000', 'http://192.168.100.8:3000']
}))

app.use("/usuarios", usuariosRoutes)
app.use("/auth", authRoutes)
app.use("/peliculas", peliculasRoutes)
app.use("/generos", generosRoutes)
app.use("/directores", directoresRoutes)
app.use("/actores", actoresRoutes)
app.use("/idiomas", idiomasRoutes)
app.use("/uploads", uploadsRoutes)
app.use("/funciones", funcionesRoutes)

/* Ejecutamos un cron schedule cada 25 minutos */
cron.schedule('*/25 * * * *', () => {
    console.log('Limpiando usuarios - ejecucion cada 25 minutos');
    cleanUsers()
});

// Iniciamos el cliente de whatsapp
startWhatsapp()




app.use((req, res) => {
    res.status(400).json({ message: "Sin permisos para acceder a este recurso" })
})

export default app