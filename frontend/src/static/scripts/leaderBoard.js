//socket created

const smth = document.createElement("div")
smth.textContent = "Do SOMETHING"
smth.addEventListener('click', () => {
  socket.emit('leaderboard: button_pressed')
})
document.body.append(smth)

const socket = io()

socket.on('connect', () => {
    console.log('leaderboard connected on socket:', socket.id)
    socket.emit('join_room', 'race-flags')
})
