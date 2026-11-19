const fs = require('fs/promises')
const path = require('path')
const raceFlagsHandler = require('express').Router()
const raceFlagsHtml = path.resolve(
    __dirname,
    '../../frontend/raceFlags.html'
)

raceFlagsHandler.get('/', async(request, response) => {
    try{
        const html = await fs.readFile(raceFlagsHtml, 'utf-8')

        response.status(200).type('html').send(html)
    } catch (error) {
        response.status(500).json({error: 'Server error.'})
    }
})

module.exports = raceFlagsHandler
