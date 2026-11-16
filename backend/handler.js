exports.frontDeskHandler = function (req, res) {
  res.statusCode = 200
  res.end("stranitsa dlya front desk")
}

exports.raceControlHandler = function (req, res) {
  res.statusCode = 200
  res.end("stranitsa dlya race control")
}

exports.lapLineTrackerHandler = function (req, res) {
  res.statusCode = 200
  res.end("stranitsa dlya lap line tracker")
}

exports.leaderBoardHandler = function (req, res) {
  res.statusCode = 200
  res.end("stranitsa dlya leader board")
}

exports.nextRaceHandler = function (req, res) {
  res.statusCode = 200
  res.end("stranitsa dlya next race")
}

exports.raceCountdownHandler = function (req, res) {
  res.statusCode = 200
  res.end("stranitsa dlya race countdown")
}

exports.raceFlagsHandler = function (req, res) {
  res.statusCode = 200
  res.end("stranitsa dlya race flags")
}

exports.notFoundHandler = function (req, res) {
  res.statusCode = 404
  res.end("stranitsa dlya not found")
}
