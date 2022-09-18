import express, { Express } from 'express'
import getRoutes from './routes/get'
import postRoutes from './routes/post'

let app: Express = express()

app.use(getRoutes)
app.use(express.json(), postRoutes)
export default {
  path: '/api/',
  handler: app,
}
