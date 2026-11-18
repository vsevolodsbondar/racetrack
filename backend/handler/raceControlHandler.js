const fs = require('fs/promises')
const path = require('path')
const raceControlHandler = require('express').Router()
const raceControlHtml = path.resolve(
    __dirname,
    '../../frontend/raceControl.html'
)

raceControlHandler.get('/', async(request, response) => {
    try{
        const html = await fs.readFile(raceControlHtml, 'utf-8')

        response.status(200).type('html').send(html)
    } catch (error) {
        response.status(500).json({error: 'Server error.'})
    }
})

module.exports = raceControlHandler
