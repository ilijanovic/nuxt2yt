import express, { Express } from 'express'
import getRoutes from './routes/get'
import postRoutes from './routes/post'
import ioMethod, { Socket } from 'socket.io'

//@ts-ignore
const _io = ioMethod(5000, {
  cors: {
    origin: '*',
  },
})
let app: Express = express()

app.use(getRoutes)
app.use(express.json(), postRoutes)
export default app

export const io = _io as Socket
