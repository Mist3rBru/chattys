const socket = io()

socket.emit('rooms', '', rooms => {
  const selectRoom = document.querySelector('select[name=room]')
  rooms.forEach(room => selectRoom.insertAdjacentHTML('beforeend', `<option>${room}</option`))
})
