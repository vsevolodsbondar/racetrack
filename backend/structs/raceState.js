const RACE_STATUS = Object.freeze({
    RUNNING: "running", //Timer is going, laps are counted
    FINNISHED: "finnished", //Finish mode, cars are returning, laps are still counted
    ENDED: "ended", // Safety Official ended the session, laps are not counted
})

const RACE_FLAG_STATE = Object.freeze({
    SAFE: "safe",
    HAZARD: "hazard",
    DANGER: "danger",
    FINNISH: "finnish"
})


class RaceState {
    raceSessions = [] // array of RaceSession obj
    race = null //curr Race obj

    initiateRace(raceSession) {
        this.race = new Race(raceSession)
    }

    endRace() {
        if (!this.race) return

        this.race.changeRaceStatus(RACE_STATUS.ENDED)
        this.raceSessions.push(this.race)
    }
}

class RaceSession {
    constructor(id, drivers = []) {
        this.id = id
        this.drivers = drivers
    }
}

class Driver {
    constructor(carNumber, driverName) {
        this.carNumber = carNumber
        this.driverName = driverName
    }
}

class Race {
    raceSession // RaceSession obj
    raceStatus = RACE_STATUS.ENDED// RaceStatus "enum"
    raceFlag = RACE_FLAG_STATE.DANGER //RaceFlagSate obj
    endsAt = null // server time (ms) when the timer ends
    laps = new Map() //map with lap obj starts with 1:

    constructor(raceSession) {
        this.raceSession = raceSession
    }

    startRace(durationMs) {
        this.raceStatus = RACE_STATUS.RUNNING
        this.endsAt = Date.now() + durationMs
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

class Lap {
    constructor(lapCount) {
        this.lapCount = lapCount // number of finnished laps
        this.lastLapCrossedAt = null // timestamp of the crossing of the last lap
        this.fastestLapMs = null // best result of the lap
    }
}

