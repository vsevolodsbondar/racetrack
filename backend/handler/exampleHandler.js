const exampleHandler = require('express').Router()

exampleHandler.get('/', async(request, response) => {
    try{
        response.status(200).json("SOSI PISOS")
        if (!"SOSI PISOS") {
            response.status(200).json("SOSI BIBU")
        }
    } catch (error) {
        response.status(500).json({error: 'Failed to SOSI PISOS'})
    }
})

module.exports = exampleHandler