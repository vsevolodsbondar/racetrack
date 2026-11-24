import { v4 as uuidv4 } from 'uuid';

const RACE_STATUS = Object.freeze({
    NOT_STARTED: "not started", // Race announced
    RUNNING: "running", //Timer is going, laps are counted
    FINISHING: "finnishing", //Finish mode, cars are returning, laps are still counted
    ENDED: "ended", // Safety Official ended the session, laps are not counted
})

const RACE_FLAG_STATE = Object.freeze({
    SAFE: "safe",
    HAZARD: "hazard",
    DANGER: "danger",
    FINNISH: "finnish"
})


class RaceState {
    passedRaces = [] // array of RaceSession obj
    currentRace = null //curr Race obj

    initiateNewRace() {
        this.currentRace = new Race()
    }

    forceEndRace() {
        if (!this.currentRace) return

        this.currentRace.changeRaceStatus(RACE_STATUS.ENDED)
        this.raceSessions.push(this.currentRace)
    }
}

class Race {
    raceId
    raceStatus // RaceStatus "enum"
    raceFlag // RaceFlagSate "enum"
    endsAt // server time (ms) when the timer ends
    drivers

    constructor() {
        this.raceId = uuidv4()
        this.drivers = new Map()
        this.raceStatus = RACE_STATUS.NOT_STARTED
        this.raceFlag = RACE_FLAG_STATE.DANGER
        this.endsAt = null
    }

    addDriverToRace(carNumber, driverName) {
        const currDrivers = this.drivers.size
        if (currDrivers >= 8) return false

        if (this.drivers.has(carNumber)) return false

        const driver = new Driver(carNumber, driverName)
        this.drivers.set(carNumber, driver)

        return true
    }

    removeDriverFromRace(carNumber) {
        return this.drivers.delete(carNumber)
    }

    startRace(durationMs) {
        this.raceStatus = RACE_STATUS.RUNNING
        this.endsAt = Date.now() + durationMs
    }

    registerFinishLineCrossing(carNumber, crossedAt = Date.now()) {
        if (this.raceStatus !== RACE_STATUS.RUNNING && this.raceStatus !== RACE_STATUS.FINISHING) {
            return null
        }

        const driver = this.drivers.get(carNumber)

        if (!driver) {
            throw new Error("Driver not found")
        }

        if (this.raceStatus === RACE_STATUS.FINISHING) {
            return driver.finishRace(crossedAt)
        }

        return driver.registerFinishLineCrossing(crossedAt)
    }

    changeFlag(flag) {
        if (!Object.values(RACE_FLAG_STATE).includes(flag)) {
            throw new Error("Invalid race flag")
        }

        this.raceFlag = flag
    }

    changeRaceStatus(status) {
        if (!Object.values(RACE_STATUS).includes(status)) {
            throw new Error("Invalid race status")
        }

        this.raceStatus = status
    }
}

class Driver {
    completedLaps = []
    currentLap = null
    finishedAt = null
    carNumber
    driverName

    constructor(carNumber, driverName) {
        this.carNumber = carNumber
        this.driverName = driverName
    }

    registerFinishLineCrossing(crossedAt) {
        if (this.finishedAt !== null) return null

        // First crossing: start lap 1
        if (this.currentLap === null) {
            this.currentLap = new Lap(1, crossedAt)
            return null
        }

        // Complete current lap
        this.currentLap.finishLap(crossedAt)

        const completedLap = this.currentLap
        this.completedLaps.push(completedLap)

        // Start next lap
        this.currentLap = new Lap(
            completedLap.lapNumber + 1,
            crossedAt
        )

        return completedLap
    }

    finishRace(crossedAt = Date.now()) {
        if (this.finishedAt !== null) return null
        if (this.currentLap === null) return null

        const completedLap = this.registerFinishLineCrossing(crossedAt)

        this.currentLap = null
        this.finishedAt = crossedAt

        return completedLap
    }

    get fastestLapMs() {
        if (this.completedLaps.length === 0) return null

        return Math.min(...this.completedLaps.map(lap => lap.durationMs))
    }
    
}

class Lap {
    constructor(lapNumber, startedAt) {
        this.lapNumber = lapNumber
        this.startedAt = startedAt
        this.crossedAt = null
        this.durationMs = null
    }

    finishLap(crossedAt) {
        if (this.crossedAt !== null) {
            throw new Error("Lap already finished")
        }

        this.crossedAt = crossedAt
        this.durationMs = crossedAt - this.startedAt
    }
}
