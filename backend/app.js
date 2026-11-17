const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const exampleHandler = require('./handler/exampleHandler')


const app = express()


app.use(cors())
//helps app read JSON data sent from the client (like in POST or PUT requests) and makes it available in req.body
app.use(express.json())
//logging
app.use(morgan('tiny'))
app.use('/api/example', exampleHandler)

module.exports = app