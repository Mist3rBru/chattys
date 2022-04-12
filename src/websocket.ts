import { io } from './app'

const users: User[] = []
const messages: Message[] = []
const rooms: String[] = ['Node', 'Java', 'PHP']

io.on('connection', socket => {
  socket.emit('rooms', rooms)

  socket.on('selectRoom', (data: UserParams) => {
    void socket.join(data.room)
    const userInRoom = users.find(user => user.author === data.author && user.room === data.room)
    if (userInRoom) {
      userInRoom.socketId = socket.id
    } else {
      users.push({
        socketId: socket.id,
        author: data.author,
        room: data.room
      })
    }
    socket.emit('previousMessages', messages.filter(message => message.room === data.room))
  })

  socket.on('message', (message: Message) => {
    messages.push(message)
    io.to(message.room).emit('message', message)
  })
})

type UserParams = Omit<User, 'socketId'>

type User = {
  socketId: string
  author: string
  room: string
}

type Message = {
  author: string
  room: string
  text: string
  createdAt: Date
}
