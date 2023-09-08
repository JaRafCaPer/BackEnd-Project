import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'
import sessionRouter from './routes/session.router.js'
import viewsRouter from './routes/views.router.js'
import __dirname from './utils.js'
import MessageModel from "../src/DAO/mongoManager/models/message.model.js"
import productModel from './DAO/mongoManager/models/product.model.js'
import MongoStore from 'connect-mongo'
import session from "express-session"
import passport from 'passport'
import initializePassport from '../src/config/passport.config.js'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'

config({ path: '.env' })

 
const app = express()

const uri = process.env.URL_MONGO
const dbName = 'ecommerce'
const port = process.env.PORT

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')



// app.use(session({
//     store: MongoStore.create({
//         mongoUrl: uri,
//         dbName,
//         mongoOptions: {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         },
//         ttl: 100
//     }),
//     secret: 'secret',
//     resave: true,
//     saveUninitialized: true
// }))



const runServer = () => {
    const httpServer = app.listen(port, () => console.log('Listening...'))
    const io = new Server(httpServer)

    io.on('connection', socket => {
        socket.on('new-product', async data => {
            
            await productModel.create(data)
            const products = await productModel.find().lean().exec()
            io.emit('reload-table', products)
        })
    })


    io.on("connection", (socket) => {
        console.log("Nuevo cliente conectado");
        socket.on("new-message", async (data) => {
            try {
                const { user, message } = data;
                const newMessage = { user, message };
                await MessageModel.create(newMessage);
            } catch (error) {
                console.error("Error al guardar el mensaje:", error);
            }

            io.emit("message-received", data);
        });

        socket.on("disconnect", () => {
            console.log("Cliente desconectado");
        });
    });
}

app.use(cookieParser())
app.use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
}) )

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

console.log('Connecting...')
mongoose.connect(uri, {
    dbName: 'ecommerce'
})
    .then(() => {
        console.log('DB connected!!')
        
    })
    .catch(e => console.log(`Can't connect to DB`))
    runServer()

    app.use('/', viewsRouter)
    app.use('/api/products', productRouter)
    app.use('/api/carts', cartRouter)
    app.use('/api/session', sessionRouter)


