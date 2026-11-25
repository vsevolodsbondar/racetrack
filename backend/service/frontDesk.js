const { raceState } = require('../structs/raceState')

function registerDriver(carNumber, driverName) {
  if (raceState.currentRace != null) {
    raceState.currentRace.addDriverToRace(carNumber, driverName)
    return `driver ${driverName} added under number ${carNumber}`
  }

  console.log('NO CURRENT RACE')
  return('NO CURRENT RACE')

}

function deleteDriver(carNumber) {
  if (raceState.currentRace != null) {
    raceState.currentRace.removeDriverFromRace(carNumber)
    return `driver ${carNumber} has been removed from the current race`
  }

  console.log('NO CURRENT RACE')
  return('NO CURRENT RACE')

}


function registerNewRace() {
  if (raceState.currentRace == null) {
    raceState.initiateNewRace()
    return `new race initialised`
  }

  return('Error: Current race is still in process')

}

function getCurrentRaceInfo() {
  const race = raceState.currentRace
  if (race == null) return { hasRace: false, drivers: [] }

  return {
    hasRace: true,
    drivers: [...race.drivers.values()]
      .sort((a, b) => a.carNumber - b.carNumber)
      .map((d) => ({ carNumber: d.carNumber, driverName: d.driverName }))
  }
}

module.exports = {registerDriver, deleteDriver, registerNewRace, getCurrentRaceInfo}
