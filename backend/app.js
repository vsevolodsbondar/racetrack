const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const exampleHandler = require('./handler/exampleHandler')
//handlers------
const countdownHandler = require(`./handler/countdownHandler`)
const frontDeskHandler = require(`./handler/frontDeskHandler`)
const lapLineTrackerHandler = require(`./handler/lapLineTrackerHandler`)
const raceFlagsHandler = require('./handler/raceFlagsHandler')
const leaderBoardHandler = require(`./handler/leaderBoardHandler`)
const nextRaceHandler = require(`./handler/nextRaceHandler`)
const raceControlHandler = require(`./handler/raceControlHandler`)
//handlers-------
const frontendPath = path.resolve(__dirname, '../frontend')

const app = express()

app.use(express.static(frontendPath))

app.use(cors())
//helps app read JSON data sent from the client (like in POST or PUT requests) and makes it available in req.body
app.use(express.json())
//logging
app.use(morgan('tiny'))
app.use('/api/example', exampleHandler)
app.use('/front-desk', frontDeskHandler)
app.use('/race-control', raceControlHandler)
app.use('/lap-line-tracker', lapLineTrackerHandler)
app.use('/leader-board', leaderBoardHandler)
app.use('/next-race', nextRaceHandler)
app.use('/race-countdown', countdownHandler)
app.use('/race-flags', raceFlagsHandler)


module.exports = app
