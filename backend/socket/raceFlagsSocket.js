//link backend for this interface
const { doSomething } = require('../service/raceFlags.js')


function initRaceFlagsSocket(io,socket, app) {
  socket.on('race_flags: button_pressed', () => {
    const result = doSomething()
    // socket.emit('race_flags: button_pressed', result)
    console.log('race flags button handled')
  })
}

module.exports = { initRaceFlagsSocket }
