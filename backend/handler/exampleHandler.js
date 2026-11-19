const exampleHandler = require('express').Router()

exampleHandler.get('/', async(request, response) => {
    try{
        console.log("SOSI PISOS")
        if (!"SOSI PISOS") {
            console.log("SOSI BIBU")
        }
        response.status(200).json("SOSI PISos")
    } catch (error) {

    }
})

module.exports = exampleHandler
