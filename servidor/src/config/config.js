import { config } from 'dotenv'
import os from 'os'

config()

//Obtener la ip del servidor
const interfaces = os.networkInterfaces()
const addresses = []
for (let k in interfaces) {
    for (let k2 in interfaces[k]) {
        let address = interfaces[k][k2]
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address)
        }
    }
}

export const IP  = addresses[0]
console.log('IP del servidor: ' + IP)


export const PORT = process.env.PORT
export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRESIN = process.env.JWT_EXPIRESIN
export const CLIENTE = process.env.CLIENTE
export const APP_NAME = process.env.APP_NAME

//Database
export const DB_HOST = process.env.DB_HOST
export const DB_USER = process.env.DB_USER
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_PORT = process.env.DB_PORT
export const DB_DATABASE = process.env.DB_DATABASE

//NodeMailer 
export const MAIL_HOST = process.env.MAIL_HOST
export const MAILER_PORT = process.env.MAILER_PORT
export const MAILER_USER = process.env.MAILER_USER
export const MAILER_PASS = process.env.MAILER_PASS
export const MAILER_NAME = process.env.MAILER_NAME
export const MAILER_ENABLE_USER_TOKEN_EXPIRES_IN = process.env.MAILER_ENABLE_USER_TOKEN_EXPIRES_IN

//OAUTH DATA
export const OAUTH_NAME = process.env.OAUTH_NAME

//PAYPAL DATA
export const PAYPAL_API_CLIENT = process.env.PAYPAL_API_CLIENT
export const PAYPAL_API_SECRET = process.env.PAYPAL_API_SECRET
export const PAYPAL_API_HOST = process.env.PAYPAL_API_HOST


export const PAYPAL_API_APPLICATION_CONTEXT_RETURN_URL = CLIENTE + process.env.PAYPAL_API_APPLICATION_CONTEXT_RETURN_URL
export const PAYPAL_API_APPLICATION_CONTEXT_CANCEL_URL = CLIENTE + process.env.PAYPAL_API_APPLICATION_CONTEXT_CANCEL_URL
