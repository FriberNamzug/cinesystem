/* import pkg from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'
import logger from "../config/logger.js";

const { Client, LocalAuth } = pkg;

const clientWhatsapp = new Client({
    authStrategy: new LocalAuth()
})

const startWhatsapp = async () => {
    await clientWhatsapp.initialize()
}

// mostramos el codigo QR para escanear
clientWhatsapp.on('qr', (qr) => {
    qrcode.generate(qr, { small: true })
})

// mostramos el mensaje de que se conecto
clientWhatsapp.on('ready', () => {
    console.log('Cliente de whatsapp conectado')
})

// mostramos el mensaje de que se desconecto
clientWhatsapp.on('disconnected', (reason) => {
    console.log('Cliente de whatsapp desconectado', reason)
})


export const sendWhatsappMessage = async (numero, mensaje) => {
    //Comprobamos que el numero tenga el formato correcto de "+5214494661233"
    if (numero.length === 13 && numero.substring(0, 3) === "+52") return { error: "El numero no tiene el formato correcto" }

    const chatId = numero.substring(1) + "@c.us";

    clientWhatsapp.isRegisteredUser(chatId).then(isRegistered => {
        if (isRegistered) {
            clientWhatsapp.sendMessage(chatId, mensaje);
            console.log("Mensaje enviado a: " + numero);
        } else {
            console.log("El numero no esta registrado en whatsapp: " + numero);
        }
    }).catch(err => {
        logger.error(err)
        console.log(err)
    })

}










export default startWhatsapp */