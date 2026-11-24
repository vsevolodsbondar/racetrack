//link backend for this interface
const { doSomething } = require('../service/leaderBoard.js')


function initLeaderBoardSocket(io,socket, app) {
  socket.on('leaderboard: button_pressed', () => {
    const result = doSomething()
    // socket.emit('leaderboard: button_pressed', result)
    console.log('leaderboard button handled')
  })
}

module.exports = { initLeaderBoardSocket }
