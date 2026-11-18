const countdownDiv = document.createElement("div")

function countdown(minutes) {
    document.body.appendChild(countdownDiv)

    let msForTimer = minutes * 60 * 1000
    // when timer will end
    const endTime = Date.now() + msForTimer

    const timer = setInterval(() => {
        //calculating what's left after interval
        const remaining = Math.max(0, endTime - Date.now())

        const ms = remaining % 1000
        const totalSeconds = Math.floor(remaining / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60

        countdownDiv.textContent =
            `${String(minutes).padStart(2, "0")}:` +
            `${String(seconds).padStart(2, "0")}:` +
            `${String(ms).padStart(3, "0")}`

        if (remaining === 0) {
            clearInterval(timer)
        }
    }, 1)
}

countdown(1)
