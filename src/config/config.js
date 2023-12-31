import dotenv from 'dotenv'
dotenv.config({path: '.env'})

export default  {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    DB_NAME: process.env.DB_NAME,
    CLIENT_ID_GITHUB: process.env.CLIENT_ID_GITHUB,
    CLIENT_SECRET_GITHUB: process.env.CLIENT_SECRET_GITHUB,
    CALLBACK_URL_GITHUB: process.env.CALLBACK_URL_GITHUB,
    SECRET_JWT: process.env.SECRET_JWT,
    PERSISTENCE: process.env.PERSISTENCE,
    SECRET_KEY: process.env.SECRET_KEY,
    USER: process.env.USER,
    PASS: process.env.PASS,
    AMBIENT: process.env.AMBIENT,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY
}