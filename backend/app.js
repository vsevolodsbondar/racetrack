const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const exampleHandler = require('./handler/exampleHandler')
const countdownHandler = require(`./handler/countdownHandler`)
const frontendPath = path.resolve(__dirname, '../frontend')

const app = express()

app.use(express.static(frontendPath))

app.use(cors())
//helps app read JSON data sent from the client (like in POST or PUT requests) and makes it available in req.body
app.use(express.json())
//logging
app.use(morgan('tiny'))
app.use('/api/example', exampleHandler)
app.use('/race-countdown', countdownHandler)

module.exports = app