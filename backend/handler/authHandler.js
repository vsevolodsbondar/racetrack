const validateKeys = require("../helper/keyValidation.js")
const authHandler = require('express').Router()

authHandler.post('/', async (request, response) => {
    if (!request.body || !request.body.accessKey || !request.body.accessRoute) {
        return response.status(400).json({
            error: "Access key is required."
        })
    }

    const accessKey = request.body.accessKey
    const accessRoute = request.body.accessRoute

    try{
        if (!validateKeys(accessKey,accessRoute)) {
            await sleep(500)

            response.status(401).json({})
        } else {
            response.status(202).json({})
        }
    } catch (error) {
        response.status(500).json({error: 'Server error.'})
    }
})

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

module.exports = authHandler