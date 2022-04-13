import { io } from './app'
import { Message, UserParams } from './domain'
import { rooms, users, messages } from './database'

io.on('connection', socket => {
  socket.on('rooms', (data, cb) => {
    rooms.forEach(room => {
      io.to(room).emit('users', users.filter(user => user.room === room))
    })
    cb(rooms)
  })

  socket.on('selectRoom', (data: UserParams, cb) => {
    void socket.join(data.room)
    const userInRoom = users.find(user => user.name === data.name && user.room === data.room)
    if (userInRoom) {
      userInRoom.socketId = socket.id
    } else {
      users.push({
        socketId: socket.id,
        name: data.name,
        room: data.room
      })
    }
    io.to(data.room).emit('previousMessages', messages.filter(message => message.room === data.room))
    io.to(data.room).emit('users', users.filter(user => user.room === data.room))
  })

  socket.on('leaveRoom', (room) => {
    users.forEach((user, index) => {
      if (user.socketId === socket.id) return users.splice(index, 1)
    })
    void socket.leave(room)
  })

  socket.on('users', (data) => {
    io.to(data.room).emit('users', users.filter(user => user.room === data.room))
  })

  socket.on('message', (message: Message) => {
    messages.push(message)
    io.to(message.room).emit('message', message)
  })
})
