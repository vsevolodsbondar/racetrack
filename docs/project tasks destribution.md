# Tasks and work split

## How we split the work

The system is split into two parts by **feature**, not by "backend / frontend".
Each person owns their part end-to-end (server logic + pages), so we don't wait for each other.

- **A: People & laps** — sessions, drivers, cars, lap counting, results
- **B: Race & time** — start/finish/end of a race, timer, race modes, flags

|        | A (people & laps)                                     | B (race & time)                          |
| ------ | ----------------------------------------------------- | ---------------------------------------- |
| Server | sessions, drivers, cars, laps, authentication         | timer, race modes, race lifecycle        |
| Pages  | front-desk, next-race, lap-line-tracker, leader-board | race-control, race-countdown, race-flags |

## Rules to avoid conflicts

1. **Own your files.** Don't edit files from the other part. If you need something changed, ask.
2. **Follow the contract (#2).** State shape and event names are agreed together.
   If something in the contract must change, discuss it first and update the contract.
3. **Keep `server.js` small.** Each part lives in its own file(s); `server.js` only connects them.
4. **Don't wait.** If the other part is not ready, use fake test data that matches the contract.
5. **One branch per issue.** Write `closes #N` in the PR or commit message.
6. Run `npm run format` before every commit.

## Order

1. **#2 together** — before anything else
2. **A starts with #3 (authentication)**, because race-control (B) needs it.
   Meanwhile B starts with public pages (no password needed).
3. Each person works through their list
4. **#16–#18 together** at the end

## Issues

### Done

- [ ] **#1 Project setup**
  - [ ] Node.js project, express, socket.io, Biome
  - [ ] `npm start` (10 min) / `npm run dev` (1 min)
  - [ ] Server refuses to start without access keys
  - [ ] Routes for all 7 pages (placeholders)
  - [ ] Browser connects to Socket.IO

### Together (first)

- [ ] **#2 Contract: state, socket events, file structure**
  - [ ] Shape of the race state (sessions, drivers, cars, race mode, timer, laps)
  - [ ] Names and data of all socket events
  - [ ] File structure: which files belong to A and B
  - [ ] Written down in `docs/contract.md`

### A: People & laps

- [ ] **#3 Authentication for employee pages** (do first)
  - [ ] Each employee page asks for its own access key before connecting
  - [ ] Wrong key → server waits 500ms, sends an error
  - [ ] Page shows the error and asks again

- [ ] **#4 Sessions & drivers logic (server)**
  - [ ] Add/remove sessions
  - [ ] Add/edit/remove drivers (max 8, unique names in a session)
  - [ ] Automatic car assignment
  - [ ] Broadcast changes to everyone

- [ ] **#5 Front Desk page**
  - [ ] List of upcoming sessions
  - [ ] Add/remove sessions
  - [ ] Add/edit/remove drivers

- [ ] **#6 Next Race page**
  - [ ] Drivers and cars of the next session
  - [ ] "Proceed to the paddock" message after the session is ended

- [ ] **#7 Lap counting logic (server)**
  - [ ] First crossing starts lap 1, every crossing increments the lap
  - [ ] Fastest lap per car is updated
  - [ ] Works in Finish mode, rejected after the session has ended

- [ ] **#8 Lap-line Tracker page**
  - [ ] One big button per car (only the car number)
  - [ ] Works in portrait and landscape
  - [ ] Buttons disabled/hidden after the session ends, with a message

- [ ] **#9 Leader Board page**
  - [ ] Cars and drivers sorted by fastest lap
  - [ ] Fastest lap and current lap for each car
  - [ ] Remaining time and flag status
  - [ ] Last race stays visible until the next race starts

### B: Race & time

- [ ] **#10 Race timer (server)**
  - [ ] Countdown starts with the race (10 min / 1 min with `npm run dev`)
  - [ ] Remaining time is broadcast in real time
  - [ ] At 0 → Finish mode

- [ ] **#11 Race modes & lifecycle (server)**
  - [ ] Start race → Safe mode
  - [ ] Modes: Safe / Hazard / Danger / Finish
  - [ ] Finish cannot be changed to another mode
  - [ ] End session (only after Finish) → Danger, next session is queued

- [ ] **#12 Race Flags page**
  - [ ] Full screen: green / yellow / red / chequered
  - [ ] Nothing else on the screen

- [ ] **#13 Race Countdown page**
  - [ ] Big timer with remaining time, updates in real time

- [ ] **#14 Race Control page** (after #3)
  - [ ] Next session's drivers and cars for briefing
  - [ ] "Start race" button
  - [ ] 4 mode buttons during the race
  - [ ] "End session" button after Finish
  - [ ] Works on a small phone screen

- [ ] **#15 Fullscreen button for public pages**
  - [ ] leader-board, next-race, race-countdown, race-flags

### Together (end)

- [ ] **#16 Expose to the internet**
  - [ ] Set up ngrok (or similar)
  - [ ] Test pages from a phone on another network

- [ ] **#17 README + user guide**
  - [ ] How to start the server (env variables)
  - [ ] How to use each page, with screenshots

- [ ] **#18 Full race flow test**
  - [ ] Full race with `npm run dev`, several devices open at the same time

### Optional (extra requirements)

- [ ] Persist data, so the server can restart without losing state
- [ ] Let the receptionist choose cars for drivers
