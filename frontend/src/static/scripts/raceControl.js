//socket created

const smth = document.createElement("div")
smth.textContent = "Do SOMETHING"
smth.addEventListener('click', () => {
  socket.emit('race_control: button_pressed')
})
document.body.append(smth)

const socket = io()

socket.on('connect', () => {
    console.log('race control connected on socket:', socket.id)
    socket.emit('join_room', 'race-control')
})
