# Contract (#2)

Our agreement about **data**, **messages** and **files**.
Both A and B follow it, so we can work in parallel.
If something must change → discuss first, then update this file.

Status: **proposal** — tick `[x]` when we both agree.

---

## 1. General rules

- [ ] **Event names:** `topic.action`, lowercase. Examples: `session.add`, `driver.edit`, `race.start`, `lap.cross`.
- [ ] **One big state event.** On every change the server sends the **whole state** to everyone
  in one event: `state`. Each page takes only what it needs.
  Why: our data is small (max 8 cars), and we only need to agree on one update event.
- [ ] **On connect:** the server immediately sends `state` to the new page,
  so a page opened in the middle of a race shows everything right away.
- [ ] **Timer:** while a race is running, the server also sends `state` **every second**.
  Pages never calculate time themselves (device clocks can be different from the server clock).

---

## 2. State

The server keeps one object in memory:

```js
state = {
	sessions: [
		// upcoming sessions, in order. sessions[0] = next to brief
		{
			id: "550e8400-e29b-41d4-a716-446655440000",
			drivers: [
				{ car: 1, name: "Anna" },
				{ car: 2, name: "Peter" },
			],
		},
	],
	race: null, // the race on the track, or the last race (see below)
	mode: "danger", // current flag
};
```

`race` (when not null):

```js
race = {
  session: { id: "550e8400-e29b-41d4-a716-446655440000", drivers: [...] },
  status: "running",                   // "running" | "finished" | "ended"
  endsAt: 1731150000000,               // server time (ms) when the timer ends
  laps: {
    1: { lapCount: 2, lastCrossAt: 1731149500000, fastestLapMs: 41230 },
    2: { lapCount: 1, lastCrossAt: 1731149510000, fastestLapMs: null },
  },
};
```

- [ ] **Session id:** newly created sessions use a UUID string from `randomUUID()`.
  Existing development fixtures still use numeric IDs; clients send the ID unchanged.
  Front Desk displays `Session 1`, `Session 2`, etc. by current queue position, not ID.
  Removing or starting a session renumbers the displayed queue; stored IDs stay unchanged.
- [ ] **Driver is identified by car number** inside a session (car numbers are unique in a session).
  The name can be edited freely — nothing else points to the name.
- [ ] **Cars:** numbers 1–8. A new driver gets the **lowest free number**.
- [ ] **Max 8 drivers** per session. **Names unique** inside a session.
- [ ] **Mode values:** `"safe"`, `"hazard"`, `"danger"`, `"finish"`. Start value: `"danger"` (nobody drives).
- [ ] **Status values** (stage of the race, not the flag):
  - `"running"` — timer is going, laps are counted
  - `"finished"` — Finish mode, cars are returning, laps are still counted
  - `"ended"` — Safety Official ended the session, laps are **not** counted
- [ ] **The last race stays in `race`** with status `"ended"` until the next race starts.
  This is how the leader board keeps showing the last results.
- [ ] **Timer:** store `endsAt`, not the remaining time. The server adds `remainingMs`
  to the `state` it sends (`endsAt - now`, never below 0).

### Laps

- [ ] First crossing: `lapCount = 1`, `lastCrossAt = now`, `fastestLapMs = null` (lap 1 just started).
- [ ] Every next crossing: `lapTime = now - lastCrossAt` → `lapCount + 1`,
  update `fastestLapMs` if `lapTime` is smaller, `lastCrossAt = now`.
- [ ] No completed lap yet → show `—`. On the leader board these cars are at the bottom.

### Race flow

| Action          | Allowed when                                                  | What happens                                                                     |
| --------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Start race      | `sessions` not empty AND (`race` is null OR status `"ended"`) | `sessions[0]` moves into `race`, status `"running"`, mode `"safe"`, timer starts |
| Change mode     | status `"running"`                                            | mode changes (choosing `"finish"` = finish the race)                             |
| Timer reaches 0 | status `"running"`                                            | mode `"finish"`, status `"finished"`                                             |
| Finish button   | status `"running"`                                            | same as timer reaching 0                                                         |
| End session     | status `"finished"`                                           | status `"ended"`, mode `"danger"`                                                |

### What each page shows

| Page             | Shows                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------- |
| front-desk       | `sessions`                                                                               |
| next-race        | `sessions[0]`; "proceed to the paddock" when `race` is null or status `"ended"`          |
| race-control     | before start: `sessions[0]`; during race: mode buttons; after finish: End session button |
| lap-line-tracker | buttons for cars in `race`; disabled + message when status `"ended"`                     |
| leader-board     | `race` laps sorted by `fastestLapMs`, `remainingMs`, `mode`                              |
| race-countdown   | `remainingMs`                                                                            |
| race-flags       | `mode`                                                                                   |

---

## 3. Events

### Client → server

| Action               | Page             | Event            | Data                          |
| -------------------- | ---------------- | ---------------- | ----------------------------- |
| Add session          | front-desk       | `session.add`    | no arguments                  |
| Remove session       | front-desk       | `session.remove` | `sessionId`                   |
| Add driver           | front-desk       | `driver.add`     | `sessionId, name, reply`      |
| Edit driver          | front-desk       | `driver.edit`    | `sessionId, car, name, reply` |
| Remove driver        | front-desk       | `driver.remove`  | `sessionId, car, reply`       |
| Start race           | race-control     | `race.start`     | —                             |
| Change mode          | race-control     | `race.mode`      | `{ mode }`                    |
| End session          | race-control     | `race.end`       | —                             |
| Car crossed the line | lap-line-tracker | `lap.cross`      | `{ car }`                     |

### Server → client

Front Desk emits on the authenticated `/front-desk` namespace. Arguments above are
positional, not a single object. `car` is a number; names are editable labels.
Driver actions require a success acknowledgement callback (`reply`). It receives the added/edited
`{ car, name }` or `{}` after deletion. On failure, the server sends `action.error`
with `{ message }` only to the requester and does not call the success callback.
Invalid driver actions leave state unchanged and do not broadcast. Session creation/deletion
have no acknowledgement. See [Sessions and Front Desk](sessions.md).

`broadcastState(io)` sends to `/`, `/front-desk`, `/race-control`, and `/lap-line-tracker`.
Front Desk also triggers a broadcast on connection to load existing sessions.

| Event          | To whom                                                            | Data                        |
| -------------- | ------------------------------------------------------------------ | --------------------------- |
| `state`        | everyone (on every change, on connect, every second during a race) | whole state + `remainingMs` |
| `action.error` | only the page that sent a wrong action                             | `{ message }`               |

- [ ] **Invalid action:** driver errors (duplicate name, 9th driver, etc.) and
  race errors use `action.error` with `{ message }`.
  The requesting page shows the message; failed actions do not change state.

---

## 4. Authentication

- [x] Each employee page has its **own Socket.IO namespace**:

| Page             | Namespace           | Role         | Key                |
| ---------------- | ------------------- | ------------ | ------------------ |
| front-desk       | `/front-desk`       | receptionist | `RECEPTIONIST_KEY` |
| race-control     | `/race-control`     | safety       | `SAFETY_KEY`       |
| lap-line-tracker | `/lap-line-tracker` | observer     | `OBSERVER_KEY`     |
| public pages     | `/`                 | —            | no key             |

- [x] The page connects with `io("/<page>", { auth: { key } })`.
  The namespace selects the role; clients do not send a role field.
  Valid keys are reused from per-page `sessionStorage`.
- [x] The server checks the key in the namespace middleware (`np.use`) **before** the connection is accepted
- [x] Wrong key → server waits **500ms**, then rejects with an error.
  The server error is `"the provided key is Invalid"`; the page catches `connect_error`,
  shows `"Incorrect Access Key"` and asks again.
- [x] Authentication setup runs once per client socket (`once("connect", ...)`),
  so automatic reconnection keeps existing page listeners without registering them again.
- [x] **Permissions come from the namespace:** each namespace only has its own handlers.

| Namespace           | Handlers                                   |
| ------------------- | ------------------------------------------ |
| `/front-desk`       | `session.*`, `driver:*`                    |
| `/race-control`     | `race:*`                                   |
| `/lap-line-tracker` | `lap.cross` (planned; not implemented yet) |
| `/`                 | none, only receives `state`                |

Nobody can send `race.start` without the key, because the handler doesn't exist in `/`.

- [x] `broadcastState` sends `state` to **all** namespaces (list in `src/state.js`)
- [ ] Every namespace sends `state` on connect. Currently `/` and `/race-control`
  send directly; `/front-desk` triggers a broadcast. Initial state for `/lap-line-tracker`
  remains to be implemented.

## 5. Edge cases

- [ ] Start race with no sessions → `action.error` "No sessions to start"
- [ ] Start race when the current race is not ended → `action.error`
- [ ] Remove/edit a session that is racing → impossible: it is no longer in `sessions`, it is in `race`
- [ ] `lap.cross` when `race` is null or status `"ended"` → ignored, `action.error`
- [ ] `lap.cross` for a car that is not in the race → `action.error`
- [ ] Start a session with 0 drivers → allowed (empty race, timer still works)
- [ ] Mode change after `"finish"` → `action.error`

---

## 6. File structure

| File                            | Owner             | What's inside                                                               |
| ------------------------------- | ----------------- | --------------------------------------------------------------------------- |
| `server.js`                     | together          | express, Socket.IO, routes, connects the modules below                      |
| `config.js`                     | together          | `--dev` flag, race duration, access keys                                    |
| `src/state.js`                  | together          | the `state` object + `broadcastState()` (adds `remainingMs`, sends `state`) |
| `src/authenticate.js`           | A                 | employee namespace key middleware                                           |
| `src/race-session.js`           | A                 | session/driver handlers and state changes                                   |
| `src/laps.js`                   | A                 | `lap.cross` handler                                                         |
| `src/race.js`                   | B                 | `race.*` handlers, timer                                                    |
| `public/<page>.html`            | owner of the page | page markup                                                                 |
| `public/js/<page>.js`           | owner of the page | browser code for the page                                                   |
| `public/js/auth.js`             | A                 | shared employee authentication dialog and connection                        |
| `public/js/session-handlers.js` | A                 | Front Desk authentication setup, sessions and driver dialogs                |
| `public/css/style.css`          | together          | shared styles                                                               |

- [ ] Browser code goes into `public/js/`, not inline in HTML.
  The server needs `express.static` for `public/` so these files can be loaded.
- [ ] Rule: change `src/state.js` only together (it's shared by everyone).
