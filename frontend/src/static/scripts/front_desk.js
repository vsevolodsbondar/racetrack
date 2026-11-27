import authenticate from './auth/auth.js'

async function enterDesk(){
  const sessionsDiv = document.createElement("div")
  sessionsDiv.classList.add("front-desk")

  document.body.append(sessionsDiv)

  await authenticate("front-desk")

  const deskList = document.createElement("ul")
  sessionsDiv.append(deskList)

  const socket = io()

  socket.on('connect', () => {
      console.log('front desk connected on socket:', socket.id)
      socket.emit('join_room', 'front-desk')
  })

  //socket created
  const createNewRace = document.createElement("button")
  createNewRace.textContent = "Create New Race"
  createNewRace.addEventListener('click', () => {
    socket.emit('front_desk:new_race_pressed')
  })
  document.body.append(createNewRace)


  //RACER REGISTRATION FORM
  const regForm = document.createElement("div")

  const nameInput = document.createElement("input")
  nameInput.placeholder = "Driver name"

  const carInput = document.createElement("input")
  carInput.type = "text"
  carInput.placeholder = "Car number"

  const regDriver = document.createElement("button")
  regDriver.textContent = "Register Driver"
  regDriver.addEventListener('click', () => {
    socket.emit('front_desk:racer_registration_pressed', {
      carNumber: carInput.value.trim(),
      name: nameInput.value.trim()
    })
    nameInput.value = ""
    carInput.value = ""
  })

  regForm.append(nameInput, carInput, regDriver)
  document.body.append(regForm)

  //RACER DELETION FORM
    const removeForm = document.createElement("div")

    const removeCarInput = document.createElement("input")
    removeCarInput.type = "text"
    removeCarInput.placeholder = "Car number"

    const removeDriver = document.createElement("button")
    removeDriver.textContent = "Remove Driver"
    removeDriver.addEventListener('click', () => {
      socket.emit('front_desk:racer_deletion_pressed', {
        carNumber: removeCarInput.value.trim()
      })
      removeCarInput.value = ""
    })

    removeForm.append(removeCarInput, removeDriver)
  document.body.append(removeForm)

  //INFO WINDOW
  const infoWindow = document.createElement("div")
  infoWindow.classList.add("info-window")
  document.body.append(infoWindow)

  function renderInfo({ hasRace, drivers }) {
    infoWindow.replaceChildren()

    const title = document.createElement("h3")
    title.textContent = "Current race"
    infoWindow.append(title)

    if (!hasRace) {
      infoWindow.append("No current race")
      return
    }
    if (drivers.length === 0) {
      infoWindow.append("No drivers yet")
      return
    }

    const list = document.createElement("ul")
    for (const d of drivers) {
      const li = document.createElement("li")
      li.textContent = `Car ${d.carNumber}: ${d.driverName}`
      list.append(li)
    }
    infoWindow.append(list)
  }

  socket.on('current_race:updated', renderInfo)
}

enterDesk()
