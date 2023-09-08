import {fileURLToPath} from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { config } from 'dotenv'

config({ path: '.env' })

const privateKey = process.env.PRIVATE_KEY;

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password) 
}
export const generateToken = user => {
    return jwt.sign( { user }, privateKey, { expiresIn: '24h' })
}

export const extractCookie = req => {
    const token = (req?.cookies) ? req.cookies[privateKey] : null;
    return token;
}

export default __dirname