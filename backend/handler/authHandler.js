const validateKeys = require("../helper/keyValidation.js")
const authHandler = require('express').Router()

authHandler.post('/', (request, response) => {
    if (!request.body || !request.body.accessKey || !request.body.accessRoute) {
        return response.status(400).json({
            error: "Access key is required."
        })
    }

    const accessKey = request.body.accessKey
    const accessRoute = request.body.accessRoute

    try{
        if (!validateKeys(accessKey,accessRoute)) {
            response.status(401).json({})
        }

        response.status(202).json({})
    } catch (error) {
        response.status(500).json({error: 'Server error.'})
    }
})


module.exports = authHandler