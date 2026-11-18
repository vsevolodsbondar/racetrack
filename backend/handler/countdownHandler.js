const fs = require('fs/promises')
const path = require('path')
const countdownHandler = require('express').Router()
const countdownHtml = path.resolve(
    __dirname,
    '../../frontend/countdown.html'
)

countdownHandler.get('/', async(request, response) => {
    try{
        const html = await fs.readFile(countdownHtml, 'utf-8')

        response.status(200).type('html').send(html)
    } catch (error) {
        response.status(500).json({error: 'Server error.'})
    }
})

module.exports = countdownHandler