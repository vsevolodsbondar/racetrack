const fs = require('fs/promises')
const path = require('path')
const frontDeskHandler = require('express').Router()
const frontDeskHtml = path.resolve(
    __dirname,
    '../../frontend/frontDesk.html'
)

frontDeskHandler.get('/', async(request, response) => {
    try{
        const html = await fs.readFile(frontDeskHtml, 'utf-8')

        response.status(200).type('html').send(html)
    } catch (error) {
        response.status(500).json({error: 'Server error.'})
    }
})

module.exports = frontDeskHandler
