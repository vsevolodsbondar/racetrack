import authenticate from './auth.js'

async function enterDesk(){
    const sessionsDiv = document.createElement("div")
    sessionsDiv.classList.add("front-desk")

    document.body.append(sessionsDiv)

    await authenticate("front-desk")

    const deskList = document.createElement("ul")
    sessionsDiv.append(deskList)
}

enterDesk()