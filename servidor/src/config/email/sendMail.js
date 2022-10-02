import logger from "../logger.js";
import { transporter } from "./index.js";

const sendMail = (req, from, to, subject, html) => transporter.sendMail({
    from: {
        name: process.env.MAILER_NAME,
        address: from
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