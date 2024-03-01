import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from 'dotenv'
//Importaciones de la rutas
import userRouter from '../src/user/user.routes.js'
import publicRouter from '../src/publicacion/public.routes.js'
import categoryRouter from '../src/category/category.routes.js'
import comentRouter from '../src/comentario/comment.routes.js'

const app = express()
config()
const port = process.env.PORT | 3000

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

//Usamos las rutas
app.use('/user',userRouter)
app.use('/public',publicRouter)
app.use('/category',categoryRouter)
app.use('/comment',comentRouter)

export const initServer = ()=> {
    app.listen(port)
    console.log(`Serverd HTTP running in port ${port}`)
}