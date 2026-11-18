const fs = require('fs/promises')
const path = require('path')
const nextRaceHandler = require('express').Router()
const nextRaceHtml = path.resolve(
    __dirname,
    '../../frontend/nextRace.html'
)

nextRaceHandler.get('/', async(request, response) => {
    try{
        const html = await fs.readFile(nextRaceHtml, 'utf-8')

        response.status(200).type('html').send(html)
    } catch (error) {
        response.status(500).json({error: 'Server error.'})
    }
})

module.exports = nextRaceHandler
