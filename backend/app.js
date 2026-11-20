const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const exampleHandler = require('./handler/exampleHandler')
const countdownHandler = require(`./handler/countdownHandler`)
const frontendPath = path.resolve(__dirname, '../frontend')
const frontDeskHandler = require('./handler/frontDeskHandler')

const app = express()

app.use(express.static(frontendPath))
//helps app read JSON data sent from the client (like in POST or PUT requests) and makes it available in req.body
app.use(express.json())
app.use(cors())

//logging
app.use(morgan('tiny'))
app.use('/api/example', exampleHandler)
app.use('/race-countdown', countdownHandler)
app.use('/front-desk', frontDeskHandler)

module.exports = app
