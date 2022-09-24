import jwt from 'jsonwebtoken'

export default function verifyToken(req, res, next) {

    try {
        const accessToken = req.headers['x-access-token'] || req.headers['authorization']
        if (!accessToken) return res.status(401).json({ message: 'No tienes autorización para estar aquí' })
        const token = accessToken.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            console.log(process.env.JWT_SECRET)
            console.log(accessToken)
            if (err) return res.status(401).json({ message: 'El token de acceso no es válido' })
            req.user = user
            next()
        })

    } catch (error) {
        res.status(500).json({
            message: "Ocurrió un error en el servidor",
            error,
        })
        console.log(`Ocurrió un error en el servidor: ${error})`)
    }
}