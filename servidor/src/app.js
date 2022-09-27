import express from 'express'
import morgan from 'morgan'

import usuariosRoutes from './routes/usuarios.routes.js'
import authRoutes from './routes/auth.routes.js'
import peliculasRoutes from './routes/peliculas.routes.js'
import generosRoutes from './routes/generos.routes.js'
import directoresRoutes from './routes/directores.routes.js'
import actoresRoutes from './routes/actores.routes.js'
import idiomasRoutes from './routes/idiomas.routes.js'


const app = express()


app.use(express.json())
app.use(morgan('dev'))

app.use("/usuarios", usuariosRoutes)
app.use("/auth", authRoutes)
app.use("/peliculas", peliculasRoutes)
app.use("/generos", generosRoutes)
app.use("/directores", directoresRoutes)
app.use("/actores", actoresRoutes)
app.use("/idiomas", idiomasRoutes)


app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" })
})

export default app