import express from 'express'
import usuariosRoutes from './routes/usuarios.routes.js'
import authRoutes from './routes/auth.routes.js'

const app = express()

app.use(express.json())

app.use("/usuarios", usuariosRoutes)
app.use("/auth", authRoutes)

export default app