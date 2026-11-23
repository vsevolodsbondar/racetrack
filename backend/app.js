const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
//handlers------
const countdownHandler = require(`./handler/countdownHandler`)
const frontDeskHandler = require(`./handler/frontDeskHandler`)
const lapLineTrackerHandler = require(`./handler/lapLineTrackerHandler`)
const raceFlagsHandler = require('./handler/raceFlagsHandler')
const leaderBoardHandler = require(`./handler/leaderBoardHandler`)
const nextRaceHandler = require(`./handler/nextRaceHandler`)
const raceControlHandler = require(`./handler/raceControlHandler`)

const frontendPath = path.resolve(__dirname, '../frontend')
const frontDeskHandler = require('./handler/frontDeskHandler')
const authHandler = require('./handler/authHandler')

const app = express()

app.use(express.static(frontendPath))
//helps app read JSON data sent from the client (like in POST or PUT requests) and makes it available in req.body
app.use(express.json())
app.use(cors())

//logging
app.use(morgan('tiny'))
app.use('/front-desk', frontDeskHandler)
app.use('/auth', authHandler)
app.use('/front-desk', frontDeskHandler)
app.use('/race-control', raceControlHandler)
app.use('/lap-line-tracker', lapLineTrackerHandler)
app.use('/leader-board', leaderBoardHandler)
app.use('/next-race', nextRaceHandler)
app.use('/race-countdown', countdownHandler)
app.use('/race-flags', raceFlagsHandler)

module.exports = app