const app = require('./app')
const config = require('./config')
const http = require('http')
const checkAccessKeys = require('./helpers/access_key_check.js')
const duration = require('./helpers/raceDuration.js')
const {initSocket} = require('./socket/index.js')

//check if there are accesskeys set as env vars
//test keys: receptionist_key=123 observer_key=123 safety_key=123
checkAccessKeys()
duration()


const server = http.createServer(app)

//init socket server and routes
initSocket(server, app)

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
