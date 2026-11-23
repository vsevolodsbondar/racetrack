export default function createForm() {
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

