# Authentication Documentation

## 1. Overview

The application uses **access-key authentication** to restrict access to
different parts of the racetrack system.

Each protected route has its own access key, which is stored in the
backend environment variables (`.env`).

The current implementation supports three protected routes:

  Route                Required key         Purpose
  -------------------- -------------------- ---------------------
  `front-desk`         `RECEPTIONIST_KEY`   Front desk access
  `race-control`       `SAFETY_KEY`         Race control access
  `lap-line-tracker`   `OBSERVER_KEY`       Lap tracking access

The authentication process is handled by the backend. The frontend
collects the access key and sends it to the backend for validation.

**Important:** The current implementation validates credentials but does
not yet establish a persistent authenticated session. Each
authentication request is an independent validation.

## 2. Architecture

The authentication functionality is divided into frontend and backend
components.

### Frontend

-   **`front_desk.js`** --- initializes the front desk page and calls
    the authentication function.
-   **`auth.js`** --- handles the authentication flow, submits
    credentials and waits for the result.
-   **`authView.js`** --- creates and renders the authentication form.

### Backend

-   **`authHandler.js`** --- receives authentication requests and
    validates the submitted credentials.
-   **`keyValidation.js`** --- matches the requested route with its
    expected access key and checks whether the supplied key is correct.
-   **`config.js` / `.env`** --- provides the configured access keys.

## 3. Backend implementation

### 3.1. Environment configuration

**File:** `backend/.env`

Access keys are stored in the backend `.env` file:

``` env
PORT=8080

RECEPTIONIST_KEY=your_receptionist_key
SAFETY_KEY=your_safety_key
OBSERVER_KEY=your_observer_key
```

The `config.js` module loads these variables using `dotenv`.

It also contains `checkAccessKeys()`, which verifies that all required
environment variables are defined.

If one or more keys are missing, the application logs an error and
terminates.

### 3.2. Key validation

**File:** `backend/helper/keyValidation.js`

The `keyRouteMap` associates each protected route with its corresponding
access key:

``` js
const keyRouteMap = new Map([
    ["front-desk", config.RECEPTIONIST_KEY],
    ["race-control", config.SAFETY_KEY],
    ["lap-line-tracker", config.OBSERVER_KEY]
])
```

The `validateKeys(accessKey, accessRoute)` function:

1.  Retrieves the expected key using `accessRoute`.
2.  Returns `false` if the requested route is not registered.
3.  Compares the supplied access key with the expected key.
4.  Returns `true` if they match; otherwise, returns `false`.

This ensures that a key assigned to one route cannot be used to
authenticate against another route.

### 3.3. Authentication endpoint

**File:** `backend/handler/authHandler.js`

The authentication endpoint is registered in `app.js`:

``` js
app.use('/auth', authHandler)
```

It exposes the following API:

**Method:** `POST`\
**Endpoint:** `/auth`

**Request body:**

``` json
{
    "accessKey": "your_access_key",
    "accessRoute": "front-desk"
}
```

**Responses:**

  Status                        Meaning
  ----------------------------- -----------------------------------------
  `202 Accepted`                Credentials successfully validated
  `400 Bad Request`             Required request parameters are missing
  `401 Unauthorized`            Invalid access key or route
  `500 Internal Server Error`   Unexpected server error

## 4. Frontend implementation

### 4.1. Front desk initialization

**File:** `frontend/src/static/scripts/front_desk.js`

The `enterDesk()` function initializes the front desk page.

The initialization sequence is:

1.  Creates the main container for the front desk.
2.  Adds the container to the document body.
3.  Calls `authenticate("front-desk")`.
4.  Waits for the authentication Promise to resolve.
5.  Creates the sessions list after successful authentication.

``` js
async function enterDesk() {
    const sessionsDiv = document.createElement("div")
    sessionsDiv.classList.add("front-desk")

    document.body.append(sessionsDiv)

    await authenticate("front-desk")

    const deskList = document.createElement("ul")
    sessionsDiv.append(deskList)
}
```

The `authenticate()` function is asynchronous. The `await` keyword
prevents the application from proceeding with the initialization of the
front desk until authentication succeeds.

The same authentication function can be reused by other protected pages:

``` js
await authenticate("race-control")
await authenticate("lap-line-tracker")
```

### 4.2. Authentication logic

**File:** `frontend/src/static/scripts/auth/auth.js`

The `authenticate(accessRoute)` function manages the authentication
process.

It returns a Promise, allowing the calling function to wait for the
authentication result.

The process consists of the following steps:

1.  Calls `createForm()` to render the authentication form.
2.  Selects the form using its `#authForm` ID.
3.  Registers a `submit` event listener.
4.  Prevents the default form submission behavior.
5.  Retrieves the access key using the `FormData` API.
6.  Sends a POST request to the backend `/auth` endpoint.
7.  Includes the access key and requested route in the JSON request
    body.
8.  Checks the HTTP response status.
9.  If authentication fails, displays an error in the console and allows
    the user to try again.
10. If authentication succeeds, removes the form and resolves the
    Promise.

Example request:

``` js
const response = await fetch("http://localhost:8080/auth", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        accessKey,
        accessRoute
    })
})
```

The Promise is resolved only when the backend returns a successful HTTP
response.

### 4.3. Authentication form

**File:** `frontend/src/static/scripts/auth/authView.js`

The `createForm()` function is responsible exclusively for creating and
rendering the authentication interface.

It creates:

-   A container (`#authDiv`).
-   A form (`#authForm`).
-   A label prompting the user to enter an access key.
-   A required text input (`#accessKeyInput`).
-   A submit button (`#authButton`).

The form is appended directly to `document.body`.

Separating the view from the authentication logic makes the form
reusable across different protected pages and keeps DOM manipulation
independent of API communication.

## 5. Authentication flow

The following sequence illustrates the current authentication process
using the front desk page as an example:

1.  **User opens `/front-desk`.** The backend returns `front_desk.html`.
2.  **Frontend initializes `enterDesk()`.** The front desk container is
    created.
3.  **Authentication form is rendered.** `authenticate("front-desk")`
    creates the form and waits for submission.
4.  **User submits the access key.** The frontend sends `POST /auth`
    with `accessKey` and `accessRoute`.
5.  **Backend validates credentials.** `authHandler.js` calls
    `validateKeys()` from `keyValidation.js`.
6.  **Backend returns the result.**
    -   **Success --- HTTP 202:** the form is removed, the Promise
        resolves and the front desk initializes.
    -   **Failure --- HTTP 401:** the form remains available and the
        user can retry.

## 6. Project file structure

The authentication-related files are organized as follows:

``` text
racetrack/
│
├── backend/
│   ├── app.js
│   ├── config.js
│   │
│   ├── handler/
│   │   ├── authHandler.js
│   │   └── frontDeskHandler.js
│   │
│   ├── helper/
│   │   └── keyValidation.js
│   │
│   └── .env
│
└── frontend/
    ├── front_desk.html
    │
    └── src/
        └── static/
            └── scripts/
                ├── front_desk.js
                │
                └── auth/
                    ├── auth.js
                    └── authView.js
```