function NotificationControl(listNotificationEl: HTMLElement) {
    const MAP_TYPES_NOTIFICATIONS = {
        "_success": {
            icon: "check-lg"
        },
        "_error": {
            icon: "dash-circle"
        },
        "_warning": {
            icon: "exclamation-circle"
        },
        "_info": {
            icon: "info-lg"
        },
        "_extra": {
            icon: "stars"
        },
    }

    function createNotification({ body, title, type }: INotification) {
        const notificationContent = document.createElement("div")
        const notification = document.createElement("div")
        const contentEl = document.createElement("div")
        const titleEl = document.createElement("span")
        const bodyEl = document.createElement("span")
        const actionEl = document.createElement("div")
        const icon = createIcon(MAP_TYPES_NOTIFICATIONS[type].icon)
        const loading = document.createElement("i")

        contentEl.classList.add("content")
        notificationContent.classList.add("notification-content")
        notification.classList.add("notification")
        actionEl.classList.add("status")
        actionEl.setAttribute("action", type)

        loading.classList.add("timer")

        titleEl.classList.add("title")
        bodyEl.classList.add("body")

        titleEl.innerHTML = title
        bodyEl.innerHTML = body

        actionEl.appendChild(icon)
        contentEl.appendChild(titleEl)
        contentEl.appendChild(bodyEl)
        notification.appendChild(loading)
        notification.appendChild(actionEl)
        notification.appendChild(contentEl)
        notificationContent.appendChild(notification)
        listNotificationEl.appendChild(notificationContent)

        const max = 1000 * 3
        const update = 10
        let cont = 0
        let stopCont = false

        let timerCont: NodeJS.Timer

        notification.onmouseover = () => {
            stopCont = true
        }
        notification.onmouseout = () => {
            stopCont = false
        }
        notification.onclick = () => {
            clearInterval(timerCont)
            removeNotification(notificationContent)
        }
        timerCont = setInterval(() => {
            if (stopCont) { return }

            if (cont >= max) {
                clearInterval(timerCont)
                removeNotification(notificationContent)
            }

            cont += update

            let perc = Math.round((cont * 100) / max)

            loading.style.width = perc + "%"
        }, update)
    }

    function removeNotification(notification: HTMLElement) {
        notification.classList.add("hidden")
        setTimeout(() => {
            notification.remove()
        }, 300)
    }

    const createIcon = (name: string, type = "bi") => {
        const iconEl = document.createElement("i");
        iconEl.classList.add(`${type}-${name}`);
        iconEl.setAttribute("icon", "");
        return iconEl;
    }

    const newNotification = (props: INotification) => {
        createNotification(props)
    }

    return {
        newNotification
    }
}