export default function authenticate(where) {
    return new Promise((resolve) => {
        createForm()

        const form = document.querySelector("#authForm")

        form.addEventListener("submit", async (event) => {
            event.preventDefault()

            const formData = new FormData(form)
            const accessKey = formData.get("accessKey")

            try {
                const response = await fetch(`http://localhost:8080/${where}`, {
                    method: "POST",
                        headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ accessKey })
                })

                if (!response.ok) {
                    console.log("Authentication failed. Try again.")
                    return
                }

                form.remove()

                resolve(true)
            } catch (error) {
                console.error(error)
            }
        })
    })
}

function createForm() {
    const authWindowDiv = document.createElement("div")
    authWindowDiv.id = "authDiv"

    const form = document.createElement("form")
    form.id = "authForm"

    const label = document.createElement("label")
    label.htmlFor = "accessKeyInput"
    label.textContent = "Enter access key:"

    const input = document.createElement("input")
    input.type = "text"
    input.id = "accessKeyInput"
    input.name = "accessKey"
    input.required = true

    const inputButton = document.createElement("button")
    inputButton.id = "authButton"
    inputButton.type = "submit"
    inputButton.classList.add("inputButton")
    inputButton.textContent = "Send"

    form.append(label, input, inputButton)
    authWindowDiv.appendChild(form)
    document.body.appendChild(authWindowDiv)
}