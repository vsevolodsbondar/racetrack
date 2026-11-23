const fs = require('fs/promises')
const path = require('path')
const lapLineTrackerHandler = require('express').Router()
const lapLineTrackerHtml = path.resolve(
    __dirname,
    '../../frontend/lapLineTracker.html'
)

lapLineTrackerHandler.get('/', async(request, response) => {
    try{
        const html = await fs.readFile(lapLineTrackerHtml, 'utf-8')

        response.status(200).type('html').send(html)
    } catch (error) {
        response.status(500).json({error: 'Server error.'})
    }
})

module.exports = lapLineTrackerHandler
