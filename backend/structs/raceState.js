import { v4 as uuidv4 } from 'uuid';

const RACE_DURATIONS = Object.freeze({
    SHORT_RACE_MS: 60000,
    LONG_RACE_MS: 600000
})

const RACE_STATUS = Object.freeze({
    NOT_STARTED: "not started", // Race announced
    RUNNING: "running", //Timer is going, laps are counted
    FINISHING: "finnishing", //Finish mode, cars are returning, laps are still counted
    ENDED: "ended" // Safety Official ended the session, laps are not counted
})

const RACE_FLAG_STATE = Object.freeze({
    SAFE: "safe",
    HAZARD: "hazard",
    DANGER: "danger",
    FINNISH: "finnish"
})

class RaceState {
    passedRaces = [] // array of RaceSession obj
    currentRace = null // curr Race obj

    initiateNewRace() {
        if (this.currentRace) throw new Error("The current race must be ended first.")

        this.currentRace = new Race()
    }

    initiateRaceEnd() {
        if (!this.currentRace) throw new Error("No active race.")

        if (this.currentRace.raceStatus !== RACE_STATUS.RUNNING) {
            throw new Error("Race must be running to initiate race end.")
        }

        this.currentRace.changeRaceStatus(RACE_STATUS.FINISHING)
    }

    endRace() {
        if (!this.currentRace) throw new Error("No Race or Race has ended.")

        if (this.currentRace.raceStatus != RACE_STATUS.FINISHING) return false

        for (const driver of this.currentRace.drivers.values()) {
            // if driver never crossed starting line 
            if (driver.currentLap === null) {
                driver.finishedAt = "NOT STARTED."
            }

            if (driver.finishedAt === null) {
                allDriversFinnished = false
                return false
            }
        }
        
        this.passedRaces.push(this.currentRace)
        this.currentRace = null

        return true
    }

    forceRaceEnd() {
        this.currentRace = null
    }
}

class Race {
    raceId // uuid
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
        if (this.raceStatus != RACE_STATUS.NOT_STARTED) {
            return false
        }

        const currDrivers = this.drivers.size
        if (currDrivers >= 8) return false
        if (this.drivers.has(carNumber)) return false

        const driver = new Driver(carNumber, driverName)
        this.drivers.set(carNumber, driver)

        return true
    }

    removeDriverFromRace(carNumber) {
        if (this.raceStatus != RACE_STATUS.NOT_STARTED) {
            return false
        }

        return this.drivers.delete(carNumber)
    }

    startRace(durationMs) {
        if (this.raceStatus !== RACE_STATUS.NOT_STARTED) throw new Error("Race can only be started once.")
        if (this.drivers.size === 0) throw new Error("Race should have from 1 up to 8 drivers.")
        if (durationMs !== 60000 || durationMs !== 60000) throw new Error("Duration must be a 1 or 10 min.")

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

    changeRaceStatus(newStatus) {
        const allowedTransitions = {
            [RACE_STATUS.NOT_STARTED]: [RACE_STATUS.RUNNING],
            [RACE_STATUS.RUNNING]: [RACE_STATUS.FINISHING],
            [RACE_STATUS.FINISHING]: [RACE_STATUS.ENDED],
            [RACE_STATUS.ENDED]: [],
        }

        const allowed = allowedTransitions[this.raceStatus]

        if (!allowed.includes(newStatus)) {
            throw new Error(`Invalid transition: ${this.raceStatus} → ${newStatus}`)
        }

        this.raceStatus = newStatus
    }
}

class Driver {
    completedLaps = [] // representing all completed laps by the driver. stores Lap entities.
    currentLap = null   // represents current Lap of the driver
    finishedAt = null // represents the time when driver ended the race
    carNumber
    driverName

    constructor(carNumber, driverName) {
        this.carNumber = carNumber
        this.driverName = driverName
    }

    // used when race is not in FINNISHING mode
    registerFinishLineCrossing(crossedAt) {
        if (this.finishedAt !== null) return null // can't register if race was finnished by driver

        // First crossing: start lap 1
        if (this.currentLap === null) {
            this.currentLap = new Lap(1, crossedAt)
            return null
        }

        // Complete current lap
        this.currentLap.finishLap(crossedAt)

        // Adding lap to completedLaps
        const completedLap = this.currentLap
        this.completedLaps.push(completedLap)

        // Start next lap
        this.currentLap = new Lap(
            completedLap.lapNumber + 1,
            crossedAt
        )

        return completedLap
    }

    // used when race is in FINNISHING mode
    finishRace(crossedAt = Date.now()) {
        if (this.finishedAt !== null) return null
        if (this.currentLap === null) return null

        this.currentLap.finishLap(crossedAt)

        const completedLap = this.currentLap
        this.completedLaps.push(completedLap)

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
    lapNumber // represents number of the Lap instance
    startedAt // represents when this Lap started
    crossedAt // represents when lap was finnished
    durationMs // represents duration of the lap run

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
