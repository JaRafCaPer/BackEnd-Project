import {fileURLToPath} from 'url'
import {dirname} from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from './config/config.js'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


export default __dirname

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
export const isValidPassword = (user, password)=>{
    return bcrypt.compareSync(password, user.password) //solo devuelve true o false
}


export const generateToken = user =>{
    return jwt.sign({ user }, config.SECRET_JWT, {expiresIn: '36h'})
}

export const authToken = (req, res, next) =>{
    let authHeader = req.cookies[config.SECRET_JWT]

    if(!authHeader){
        return res.status(401).send({error: 'Not authenticated'})
    }
    const token = authHeader
    jwt.verify(token, config.SECRET_JWT, (error, credentials) =>{
        if(error) return res.status(403).send({error: 'Not authorized'})
        
        console.log(credentials.user)
        req.user = credentials.user
        next()
    })
}


export const extractCookie = req =>{
    return (req && req.cookies) ? req.cookies["keyCookieForJWT"] : null
}

export const authorization = rol =>{
    return async(req, res, next)=>{
        const user = req.user
        console.log(user)
        if(!user) return res.status(401).send({error: 'Unauthorized'})
        if(user.rol !== rol) return res.status(403).send({error: 'Not enough permissions'})
        return next()
    }
}

