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
