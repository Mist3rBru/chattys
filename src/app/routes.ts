import { Express } from 'express'
import upload from './upload'
import { messages } from '../database'
import { io } from './index'

export default (app: Express): void => {
  app.get('/', (req, res) => res.render('home/home.html'))
  app.post('/upload/img', upload.single('img'), (req, res) => {
    const { author, room, createdAt } = req.body
    const img = req.file.filename
    const messageModel = { author, room, img, createdAt }
    messages.push(messageModel)
    io.to(room).emit('message', messageModel)
    res.end()
  })
}
