const socket = io()
const urlSearch = new URLSearchParams(window.location.search)
const author = urlSearch.get('author')
const room = urlSearch.get('room')
const messageInput = document.querySelector('input[name=message]')
const messagesField = document.querySelector('.messages')

const renderMessage = (data) => {
  const { author, text, createdAt } = data
  let now
  if (createdAt !== now) {}
  messagesField.insertAdjacentHTML(
    'beforeEnd',
    `<div class="message">
          <span class="time">
            ${new Date(createdAt).toLocaleTimeString('pt-br', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <span class="author">${author}:</span>
          ${text}
        </div>`
  )
}

socket.emit('selectRoom', { author, room })

socket.on('previousMessages', (messages) => {
  messages.forEach((message) => renderMessage(message))
})

socket.on('message', (message) => {
  renderMessage(message)
})

document.getElementById('chat').addEventListener('submit', (e) => {
  e.preventDefault()
  if (messageInput.value) {
    const messageModel = {
      author,
      room,
      text: messageInput.value,
      createdAt: new Date()
    }
    socket.emit('message', messageModel)
  }
  messageInput.value = ''
})
