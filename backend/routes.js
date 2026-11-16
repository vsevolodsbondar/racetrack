const handlers = require("./handler.js")

//мап с рутами
const routes = {
  'GET:/front-desk': handlers.frontDeskHandler,
  'GET:/race-control': handlers.raceControlHandler,
  'GET:/lap-line-tracker': handlers.lapLineTrackerHandler,
  'GET:/leader-board': handlers.leaderBoardHandler,
  'GET:/next-race': handlers.nextRaceHandler,
  'GET:/race-countdown': handlers.raceCountdownHandler,
  'GET:/race-flags': handlers.raceFlagsHandler,
  '404': handlers.notFoundHandler,
}

module.exports = routes
