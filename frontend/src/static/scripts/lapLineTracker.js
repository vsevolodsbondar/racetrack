//socket created

const smth = document.createElement("div")
smth.textContent = "Do SOMETHING"
smth.addEventListener('click', () => {
  socket.emit('lap_line_tracker: button_pressed')
})
document.body.append(smth)

const socket = io()

socket.on('connect', () => {
    console.log('lap line tracker connected on socket:', socket.id)
    socket.emit('join_room', 'lap-line-tracker')
})
