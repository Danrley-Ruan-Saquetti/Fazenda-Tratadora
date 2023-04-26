function App() {
    const controlDB = ControlDataBase()

    const now = Date.now()

    const isAuthenticated = controlDB.getItem<Boolean>("auth.authenticated") || false
    const devIsConnected = controlDB.getItem<Boolean>("dev.edition") || false
    const expireDate = controlDB.getItem<number>("auth.expire") || now - 100000
    const isExpired = expireDate < now

    if (!devIsConnected && GLOBAL_DEPENDENCE == "production") {
        if (!isAuthenticated || isExpired) {
            const res = prompt("KEY")

            if (res !== "panoramasistemas") {
                if (res === "__devpanoramasistemas") {
                    controlDB.updateItem("dev.edition", true)
                    controlDB.updateItem("auth.authenticated", false)

                    return window.location.reload()
                }
                return
            }

            const now = new Date(Date.now())

            now.setHours(now.getHours() + 1)

            controlDB.updateItem("auth.authenticated", true)
            controlDB.updateItem("auth.expire", now.getTime())
            controlDB.updateItem("dev.edition", false)
        }
    }

    const renderControl = RenderControl()

    const initComponents = () => {
        Setup()

        const notificationControl = NotificationControl(document.querySelector(".list-notification") as HTMLElement)

        const btLogout = document.querySelector(".bt-logout") as HTMLElement

        btLogout.addEventListener("click", () => {
            controlDB.updateItem("auth.authenticated", false)
            controlDB.updateItem("dev.edition", false)

            window.location.reload()
        })

        renderControl.initComponents()
    }

    return initComponents()
}


window.onload = App