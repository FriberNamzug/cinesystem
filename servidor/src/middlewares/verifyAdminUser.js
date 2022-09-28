export default function verifyToken(req, res, next) {
    try {
            if (req.user.rol !== "Administrador") return res.status(401).json({ message: 'Sin permisos necesarios' })
            next()
    } catch (error) {
        res.status(500).json({
            message: "Ocurrió un error en el servidor",
            error,
        })
        console.log(`Ocurrió un error en el servidor: ${error})`)
    }
}