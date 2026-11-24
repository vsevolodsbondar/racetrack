const { Server } = require('socket.io')
const { initFrontDeskSocket } = require('./frontDeskSocket')
const { initRaceControlSocket } = require('./raceControlSocket')
const { initRaceFlagsSocket } = require('./raceFlagsSocket')
const { initLapLineTrackerSocket } = require('./lapLineTrackerSocket')
const { initLeaderBoardSocket } = require('./leaderBoardSocket')
const { initNextRaceSocket } = require('./nextRaceSocket')

function initSocket(server, app) {
    const io = new Server(server)

    if (app) {
        app.set('io', io)
    }

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id)

        socket.on('join_room', (room) => {
            socket.join(room)
        })

        initFrontDeskSocket(io, socket, app)
        initRaceControlSocket(io, socket, app)
        initRaceFlagsSocket(io, socket, app)
        initLapLineTrackerSocket(io, socket, app)
        initLeaderBoardSocket(io, socket, app)
        initNextRaceSocket(io, socket, app)
    })

    return io
}

module.exports = { initSocket }
