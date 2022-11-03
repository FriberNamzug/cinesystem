import { config } from 'dotenv'

config()

export const PORT = process.env.PORT
export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRESIN = process.env.JWT_EXPIRESIN
export const APP_NAME = process.env.APP_NAME
export const PAYPAL_API_APPLICATION_CONTEXT_RETURN_URL = process.env.PAYPAL_API_APPLICATION_CONTEXT_RETURN_URL
export const PAYPAL_API_APPLICATION_CONTEXT_CANCEL_URL = process.env.PAYPAL_API_APPLICATION_CONTEXT_CANCEL_URL

export const DB_HOST = process.env.DB_HOST
export const DB_USER = process.env.DB_USER
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_PORT = process.env.DB_PORT
export const DB_DATABASE = process.env.DB_DATABASE

export const PAYPAL_API_CLIENT = process.env.PAYPAL_API_CLIENT
export const PAYPAL_API_SECRET = process.env.PAYPAL_API_SECRET
export const PAYPAL_API_HOST = process.env.PAYPAL_API_HOST
