function checkAccessKeys() {
  const required = ['RECEPTIONIST_KEY', 'OBSERVER_KEY', 'SAFETY_KEY']
  const missing = required.filter((name) => !process.env[name])

  if (missing.length > 0) {
    console.error(`Missing access key: ${missing.join(', ')}\n`)
    process.exit(1)
  }
}

module.exports = checkAccessKeys
