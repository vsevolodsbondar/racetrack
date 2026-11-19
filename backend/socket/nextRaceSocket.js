//link backend for this interface
const { doSomething } = require('../service/nextRace.js')


function initNextRaceSocket(io,socket, app) {
  socket.on('next_race: button_pressed', () => {
    const result = doSomething()
    // socket.emit('next race : button_pressed', result)
    console.log('next race button handled')
  })
}

module.exports = { initNextRaceSocket }
