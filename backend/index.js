const app = require('./app')
const config = require('./config')
const http = require('http')

//check if there are accesskeys set as env vars
config.checkAccessKeys()
config.duration()

const server = http.createServer(app)

const startServer = async () => {
    try {
        console.log("Starting server...")
        // some others init components with await

        server.listen(config.PORT, () => {
            console.log(`Started server on port ${config.PORT}`)
        })

    } catch(error) {
        console.error("Failed to start the server:", error)
        process.exit(1)
    }
}

startServer()
