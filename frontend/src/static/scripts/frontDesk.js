//socket created

const reg = document.createElement("div")
reg.textContent = "Register User"
reg.addEventListener('click', () => {
  socket.emit('registration_pressed')
})
document.body.append(reg)

const socket = io()

socket.on('connect', () => {
    console.log('front desk connected on socket:', socket.id)
    socket.emit('join_room', 'front-desk')
})
