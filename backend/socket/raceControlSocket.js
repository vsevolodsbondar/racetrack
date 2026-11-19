//link backend for this interface
const { doSomething } = require('../service/raceControl.js')


function initRaceControlSocket(io,socket, app) {
  socket.on('race_control: button_pressed', () => {
    const result = doSomething()
    // socket.emit('button_pressed', result)
    console.log('race control button handled')
  })
}

module.exports = { initRaceControlSocket }
