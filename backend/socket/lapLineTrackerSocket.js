//link backend for this interface
const { doSomething } = require('../service/lapLineTracker.js')


function initLapLineTrackerSocket(io,socket, app) {
  socket.on('lap_line_tracker: button_pressed', () => {
    const result = doSomething()
    // socket.emit('lap_line_tracker: button_pressed', result)
    console.log('lap line button handled')
  })
}

module.exports = { initLapLineTrackerSocket }
