import express from 'express'
import http from 'http'
import path from 'path'
import ejs from 'ejs'
import { Server } from 'socket.io'
import setupRoutes from './routes'

const app = express()
app.use(express.static(path.join(__dirname, '../../public')))
app.set('views', path.join(__dirname, '../../public'))
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
setupRoutes(app)

const httpServer = http.createServer(app)
const io = new Server(httpServer)

export { httpServer, io }
