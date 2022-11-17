import nodemailer from "nodemailer";
import logger from "../logger.js";
import { MAIL_HOST, MAILER_USER, MAILER_PASS } from "../config.js";

const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    secure: true,
    auth: {
        user: MAILER_USER,
        pass: MAILER_PASS,
    },

})

transporter.verify().then(() => {
    console.log("El servidor de correo esta funcionando")
}).catch((err) => {
    logger.error('Servidor de correo:' + err);
    console.log("El servidor de correo no esta funcionando")
})

export default transporter;
