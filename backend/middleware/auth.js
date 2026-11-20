const config = require('../config.js')

const authMiddleware = async(request, response, next) => {
    if (!request.body || !request.body.accessKey) {
        return response.status(400).json({
            error: "Access key is required."
        })
    }

    const key = request.body.accessKey
    const url = request.originalUrl

    if (url === "/front-desk") {
        if (config.RECEPTIONIST_KEY != key) {
            return response.status(401).json({
                error: "Wrong access key."
            })
        }

        next()
    }
    
    next()
}

module.exports = authMiddleware