require('dotenv').config()

//some config that was exported from .env file like secrets or config

const PORT = process.env.PORT
const RECEPTIONIST_KEY = process.env.RECEPTIONIST_KEY
const OBSERVER_KEY = process.env.OBSERVER_KEY
const SAFETY_KEY = process.env.SAFETY_KEY


function checkAccessKeys() {
  const required = ['RECEPTIONIST_KEY', 'OBSERVER_KEY', 'SAFETY_KEY']
  const missing = required.filter((name) => !process.env[name])

  if (missing.length > 0) {
    console.error(`Missing access key: ${missing.join(', ')}\n`)
    process.exit(1)
  }
}

function duration() {
  const isDev = process.argv.includes('--dev')
  if (isDev) {
    console.log("10 MIN race")
  } else {
    console.log("1min race")
  }
}

module.exports = {
    PORT,
    SAFETY_KEY,
    OBSERVER_KEY,
    RECEPTIONIST_KEY,
    checkAccessKeys,
    duration
}
