function duration() {
  const isDev = process.argv.includes('--dev')
  if (isDev) {
    console.log("10 MIN race")
  } else {
    console.log("1min race")
  }
}

module.exports = duration
