import {fileURLToPath} from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password) 
}
export const generateToken = user => {
    return jwt.sign( { user }, 'secretForJWT', { expiresIn: '24h' })
}

export const extractCookie = req => {
    return (req && req.cookies) ? req.cookies['keyCookieForJWT'] : null
}

export default __dirname