//link backend for this interface
const { registerDriver } = require('../service/frontDesk')


function initFrontDeskSocket(io,socket, app) {
  socket.on('registration_pressed', () => {
    const result = registerDriver()
    // socket.emit('registration_pressed', result)
    console.log('registration handled')
  })
}

module.exports = { initFrontDeskSocket }
