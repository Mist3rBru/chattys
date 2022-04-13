const socket = io()
const urlSearch = new URLSearchParams(window.location.search)
const author = urlSearch.get('name')
const room = urlSearch.get('room')
const messagesField = document.querySelector('.messages')
const usersList = document.querySelector('.users-list')
const usersCount = document.querySelector('.users-count')
let lastMessageDay

const renderMessage = (data) => {
  const { author, text, createdAt } = data
  const createdDate = new Date(createdAt)
  const now = new Date()
  if (createdDate.getDay() !== lastMessageDay) {
    lastMessageDay = createdDate.getDay()
    let date
    const passedDays = now.getDate() - createdDate.getDate()
    const passedMonths = now.getMonth() - createdDate.getMonth()
    if (passedDays <= 7 && passedMonths == 0) {
      date = createdDate.toLocaleDateString('en-us', { weekday: 'long' })
    } else {
      date = createdDate.toLocaleDateString('en-us', { dateStyle: 'short' })
    }
    messagesField.insertAdjacentHTML(
      'beforeend',
      `<div class="message-day-container"><div class="message-day">${date}</div></div>`
    )
  }
  messagesField.insertAdjacentHTML(
    'beforeEnd',
    `<div class="message">
          <span class="time">
            ${createdDate.toLocaleTimeString('pt-br', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <span class="author">${author}:</span>
          ${text}
        </div>`
  )
}

const renderUsers = (users) => {
  usersCount.innerHTML = users.length
  usersList.innerHTML = ''
  users.forEach(user => {
    usersList.insertAdjacentHTML('beforeend',`<div class="user">${user.name}</div>`)
  })
}

socket.emit('selectRoom', { room, name: author })

socket.on('users', (users) => {
  renderUsers(users)
})

socket.once('previousMessages', (messages) => {
  messages.forEach((message) => renderMessage(message))
})

socket.on('message', (message) => {
  renderMessage(message)
})

document.querySelector('.room-title span').innerHTML = room

document.getElementById('leave-room').addEventListener('click', () => {
  socket.emit('leaveRoom', room)
  window.location = '/'
})

const messageInput = document.querySelector('.message-input')
messageInput.addEventListener('keypress', (e) => {
  if (e.key !== 'Enter' || !messageInput.value) return null
  const messageModel = {
    author,
    room,
    text: messageInput.value,
    createdAt: new Date(),
  }
  socket.emit('message', messageModel)
  messageInput.value = ''
})

document.querySelector('.message-send').addEventListener('click', () => {
  if (!messageInput.value) return null
  const messageModel = {
    author,
    room,
    text: messageInput.value,
    createdAt: new Date(),
  }
  socket.emit('message', messageModel)
  messageInput.value = ''
})