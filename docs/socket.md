# Socket.IO Documentation

All real-time communication in the project goes through Socket.IO. There is no polling: HTTP is used only to load pages and to establish the socket connection.

> **Status:** work in progress. "Implemented events" describes what exists in the code today. "Planned event contract" is a proposal derived from the project spec, not finished code.

---

## 1. Architecture

Every interface (employee screens and public displays) is built with the same four-layer skeleton:

```
HTML page
   └─ client script  (frontend/src/static/scripts/<name>.js)
        └─ socket.io-client: io()
             │
             ▼   Socket.IO events
   socket/<name>Socket.js      ← event handlers
        └─ service/<name>.js   ← business logic
```

| Layer | Example (Front Desk) | Responsibility |
|---|---|---|
| Page | `frontDesk.html` | Loads `/socket.io/socket.io.js` and the client script |
| Client script | `static/scripts/frontDesk.js` | Creates the socket with `io()`, emits and listens to events |
| Socket handler | `socket/frontDeskSocket.js` | Subscribes to events, calls the service, sends the response |
| Service | `service/frontDesk.js` | Pure logic. Knows nothing about sockets |

**Rule:** a socket handler contains no business logic. It receives an event, calls a service function and emits the result. This keeps the logic testable and reusable.

---

## 2. Interfaces

All seven interfaces use the same skeleton. Room name = route without the leading `/`.

| Interface | Route | Room | Type |
|---|---|---|---|
| Front Desk | `/front-desk` | `front-desk` | Employee (access key) |
| Race Control | `/race-control` | `race-control` | Employee (access key) |
| Lap-line Tracker | `/lap-line-tracker` | `lap-line-tracker` | Employee (access key) |
| Leader Board | `/leader-board` | `leader-board` | Public display |
| Next Race | `/next-race` | `next-race` | Public display |
| Race Countdown | `/race-countdown` | `race-countdown` | Public display |
| Race Flags | `/race-flags` | `race-flags` | Public display |

---

## 3. Connection

### Server (`index.js`)

```js
const server = http.createServer(app)
initSocket(server, app)      // socket/index.js: creates io and wires up all handlers
server.listen(config.PORT)
```

For every new connection, each interface initializer is called with the same signature:

```js
function initFrontDeskSocket(io, socket, app) { ... }
function initRaceFlagsSocket(io, socket, app) { ... }
// ...same shape for every interface
```

| Parameter | Meaning |
|---|---|
| `io` | The whole Socket.IO server. Used for broadcasts: `io.emit`, `io.to(room).emit` |
| `socket` | One client connection. Used to listen to that client and reply only to it |
| `app` | The Express app |

### Client

```html
<script src="/socket.io/socket.io.js"></script>
<script src="/src/static/scripts/frontDesk.js"></script>
```

```js
const socket = io()

socket.on('connect', () => {
    socket.emit('join_room', 'front-desk')
})
```

`/socket.io/socket.io.js` is served by the Socket.IO server itself, so it does not need to be added to the project.

---

## 4. Rooms

Right after connecting, every client emits `join_room` with its own room name. A broadcast to a room reaches only that type of screen.

```js
io.to('race-flags').emit('race_flags: mode_changed', { mode: 'hazard' })
```

Use cases:

- Mode change goes to `race-flags`, `leader-board` and `race-control`.
- Timer ticks go to `race-countdown` and `leader-board`.
- Session list changes go to `front-desk`, `race-control` and `next-race`.

---

## 5. Implemented events

### 5.1 `join_room`

| | |
|---|---|
| Direction | client → server |
| Sent by | every client script, on `connect` |
| Payload | `string`: room name (`'front-desk'`, `'race-flags'`, ...) |
| Response | none |

Adds the socket to the given room.

### 5.2 `registration_pressed`

| | |
|---|---|
| Direction | client → server |
| Sent by | `frontDesk.js`, click on the "Register User" placeholder |
| Payload | none |
| Handler | `socket/frontDeskSocket.js` → `initFrontDeskSocket` |
| Service | `service/frontDesk.js` → `registerDriver()` |
| Response | none yet (`socket.emit('registration_pressed', result)` is commented out) |

Flow:

1. Client emits `registration_pressed`.
2. Handler calls `registerDriver()`.
3. Service logs to the console and returns `{ message: 'Registration handled!' }`.
4. Handler logs `registration handled`.

### 5.3 `race_flags: button_pressed`

| | |
|---|---|
| Direction | client → server |
| Sent by | `raceFlags.js`, click on the "Do SOMETHING" placeholder |
| Payload | none |
| Handler | `socket/raceFlagsSocket.js` → `initRaceFlagsSocket` |
| Service | `service/raceFlags.js` → `doSomething()` |
| Response | none yet |

### 5.4 Other interfaces

Race Control, Lap-line Tracker, Leader Board, Next Race and Race Countdown use the same placeholder pattern (a dummy button, one client → server event, a service stub). Add their events to this section as they are named.

> Both events above are **placeholders** that verify the chain *client → socket handler → service*. They should be replaced with the real events from section 8.

---

## 6. Naming conventions

Current state is inconsistent:

| Event | Style |
|---|---|
| `registration_pressed` | no interface prefix |
| `race_flags: button_pressed` | prefix with a colon and a space |

Recommended single format: **`<interface>:<action>`** in `snake_case`, with no space after the colon.

- `front_desk:add_driver`
- `race_control:set_mode`
- `race_flags:mode_changed`

More rules:

- Client → server events are **commands** (`race_control:start_race`).
- Server → client events are **facts** (`race:mode_changed`).
- One event = one responsibility.
- If you rename an event, change it on the client and on the server in the same commit, otherwise the handler silently stops firing (Socket.IO does not report unknown event names).

---

## 7. How to add a new event

Example: the receptionist adds a driver.

**1. Service** (`service/frontDesk.js`): write the logic and export it.

```js
function addDriver({ sessionId, name }) {
    // validate, assign a car, store in memory
    return { ok: true, sessions: getSessions() }
}
module.exports = { registerDriver, addDriver }
```

**2. Handler** (`socket/frontDeskSocket.js`): subscribe, call the service, respond.

```js
socket.on('front_desk:add_driver', (payload) => {
    const result = addDriver(payload)
    if (!result.ok) {
        return socket.emit('front_desk:error', result.error)   // only the sender
    }
    io.emit('sessions:updated', result.sessions)               // everyone who cares
})
```

**3. Client** (`static/scripts/frontDesk.js`): emit and listen.

```js
socket.emit('front_desk:add_driver', { sessionId, name })
socket.on('sessions:updated', (sessions) => renderSessions(sessions))
```

**4. Docs:** add the event to section 5 of this file.

If you add a new interface, also register its initializer in `socket/index.js`.

### Who receives an event

| Goal | Code |
|---|---|
| Only the sender | `socket.emit(...)` |
| Everyone | `io.emit(...)` |
| Everyone in a room | `io.to('room').emit(...)` |
| Everyone except the sender | `socket.broadcast.emit(...)` |

---

## 8. Planned event contract (not implemented)

Names are proposals derived from the project spec. Agree on them with the team before implementing.

### Client → server

| Event | From | Payload | Meaning |
|---|---|---|---|
| `front_desk:add_session` | Front Desk | none | Create a race session |
| `front_desk:remove_session` | Front Desk | `{ sessionId }` | Delete a session |
| `front_desk:add_driver` | Front Desk | `{ sessionId, name }` | Add a driver (car assigned automatically) |
| `front_desk:edit_driver` | Front Desk | `{ sessionId, driverId, name }` | Rename a driver |
| `front_desk:remove_driver` | Front Desk | `{ sessionId, driverId }` | Remove a driver |
| `race_control:start_race` | Race Control | none | Start the race, mode becomes Safe |
| `race_control:set_mode` | Race Control | `{ mode }` | `safe`, `hazard`, `danger`, `finish` |
| `race_control:end_session` | Race Control | none | End the session |
| `lap_line:car_crossed` | Lap-line Tracker | `{ carNumber }` | A car crossed the lap line |

### Server → client

| Event | To room(s) | Payload | Meaning |
|---|---|---|---|
| `sessions:updated` | `front-desk`, `race-control`, `next-race` | list of sessions | Session list changed |
| `race:state` | all displays | race state | Mode, timer, laps, current session |
| `race:timer` | `race-countdown`, `leader-board` | remaining ms | Timer tick |
| `race:mode_changed` | `race-flags`, `leader-board`, `race-control` | `{ mode }` | Flag changed |
| `auth:result` | the sender | `{ ok, error? }` | Result of the access key check |

---

## 9. Rules from the spec that affect sockets

- Once the mode is `finish`, the server **rejects** any further mode change.
- The access key is checked **on the server** before the client is allowed to send commands. A wrong key gets a response after **500 ms** and the client is asked for the key again.
- The **server owns the timer**. Clients only display what the server sends.
- Race state (mode, timer, laps) lives on the server. A newly connected client must receive the current state immediately.
- No polling: all updates are pushed through events.

---

## 10. Known issues in the current code

- **Socket used before declaration.** In `frontDesk.js` and `raceFlags.js` the click handler uses `socket`, which is declared with `const` further down. It works only because the click happens after the file has run. Move `const socket = io()` to the top of each script.
- **`join_room` server handler.** It is not in the shown files. It should live in `socket/index.js` (one generic handler for all rooms). Without it, rooms do not work.
- **Room name validation.** A generic `join_room` lets any client join any room, including employee ones. Use a whitelist of room names, and require the access key for employee rooms.
- **No access control yet.** Any client can emit any event. This must be closed before real employee commands (start race, set mode, record laps) are implemented.
- **Unused `app` parameter.** Initializers receive `app` but do not use it. Remove it if it stays unused.
- **Placeholder events do not respond.** The `socket.emit(..., result)` lines are commented out, so the clients never see the service result.
