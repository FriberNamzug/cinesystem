import logger from "../logger.js";
import { transporter } from "./index.js";
import { MAILER_NAME, MAILER_USER } from "../config.js";

const sendMail = (req, to, subject, html) => transporter.sendMail({
    from: {
        name: MAILER_NAME,
        address: MAILER_USER
    },
    to: to,
    subject: subject,
    html: html
}, (error, info) => {
    if (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
    } else {
        console.log(info);
    }
});

export default sendMail;