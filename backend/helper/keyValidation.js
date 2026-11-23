const config = require('../config')

const keyRouteMap = new Map([
    ["front-desk",config.RECEPTIONIST_KEY], 
    ["race-control",config.SAFETY_KEY], 
    ["lap-line-tracker",config.OBSERVER_KEY]
])

function validateKeys(accessKey, accessRoute) {
    const expectedKey = keyRouteMap.get(accessRoute)

    if (!expectedKey) {
        return false
    }

    return expectedKey === accessKey
}

module.exports = validateKeys