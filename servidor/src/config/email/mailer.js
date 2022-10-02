import nodemailer from "nodemailer";
import logger from "../logger.js";

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    secure: true,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
    },

})

transporter.verify().then(() => {
    console.log("El servidor de correo esta funcionando")
}).catch((err) => {
    logger.error('Servidor de correo:' + err);
    console.log("El servidor de correo no esta funcionando")
})

export default transporter;
