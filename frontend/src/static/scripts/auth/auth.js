import createForm from './authView.js'

export default function authenticate(accessRoute) {
    return new Promise((resolve) => {
        createForm()

        const form = document.querySelector("#authForm")

        form.addEventListener("submit", async (event) => {
            event.preventDefault()

            const formData = new FormData(form)
            const accessKey = formData.get("accessKey")

            try {
                const response = await fetch(`http://localhost:8080/auth`, {
                    method: "POST",
                        headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ accessKey, accessRoute})
                })

                if (!response.ok) {
                    const authErrMsg = document.querySelector("#authErrMsg")
                    authErrMsg.style.opacity = 1
                    authErrMsg.textContent = "Authentification failed. Try again."

                    setTimeout(()=> {
                        authErrMsg.style.opacity = 0
                        authErrMsg.textContent = null
                    }, 2000)

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
