const {
  registerDriver,
  deleteDriver,
  registerNewRace,
  getCurrentRaceInfo
} = require('../service/frontDesk')

function initFrontDeskSocket(io, socket, app) {
  const broadcastInfo = () =>
    io.to('front-desk').emit('current_race:updated', getCurrentRaceInfo())

  socket.emit('current_race:updated', getCurrentRaceInfo())

  socket.on('front_desk:new_race_pressed', () => {
    console.log(registerNewRace())
    broadcastInfo()
  })

  socket.on('front_desk:racer_registration_pressed', ({ carNumber, name }) => {
    console.log(registerDriver(Number(carNumber), name))
    broadcastInfo()
  })

  socket.on('front_desk:racer_deletion_pressed', ({ carNumber }) => {
    console.log(deleteDriver(Number(carNumber)))
    broadcastInfo()
  })
}

module.exports = { initFrontDeskSocket }
