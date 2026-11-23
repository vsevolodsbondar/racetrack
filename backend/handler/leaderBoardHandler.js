const fs = require('fs/promises')
const path = require('path')
const leaderBoardHandler = require('express').Router()
const leaderBoardHtml = path.resolve(
    __dirname,
    '../../frontend/leaderBoard.html'
)

leaderBoardHandler.get('/', async(request, response) => {
    try{
        const html = await fs.readFile(leaderBoardHtml, 'utf-8')

        response.status(200).type('html').send(html)
    } catch (error) {
        response.status(500).json({error: 'Server error.'})
    }
})

module.exports = leaderBoardHandler
