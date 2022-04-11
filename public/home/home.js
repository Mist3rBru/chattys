const socket = io()

socket.on('rooms', rooms => {
  const selectRoom = document.querySelector('select[name=room]')
  rooms.forEach(room => selectRoom.insertAdjacentHTML('beforeend', `<option>${room}</option`))
})
