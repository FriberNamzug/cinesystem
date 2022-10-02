import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url';
import cors from 'cors'


import usuariosRoutes from './routes/usuarios.routes.js'
import authRoutes from './routes/auth.routes.js'
import peliculasRoutes from './routes/peliculas.routes.js'
import generosRoutes from './routes/generos.routes.js'
import directoresRoutes from './routes/directores.routes.js'
import actoresRoutes from './routes/actores.routes.js'
import idiomasRoutes from './routes/idiomas.routes.js'
import uploadsRoutes from './routes/uploads.routes.js'


const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.use(express.json())
app.use(express.static(path.join(__dirname, './public')))
app.use(morgan('dev'))

/* app.use(cors({
    origin: (origin, callback) => {
        if (process.env.CORS_CLIENT.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('No permitido por CORS'))
        }
    }
})) */

app.use("/usuarios", usuariosRoutes)
app.use("/auth", authRoutes)
app.use("/peliculas", peliculasRoutes)
app.use("/generos", generosRoutes)
app.use("/directores", directoresRoutes)
app.use("/actores", actoresRoutes)
app.use("/idiomas", idiomasRoutes)
app.use("/uploads", uploadsRoutes)

setInterval(() => {
    console.log("Han pasado 25 minutos")
}, 1000*60*25) // 25 minutos 



app.use((req, res) => {
    res.status(400).json({ message: "Sin permisos para acceder a este recurso" })
})

export default app