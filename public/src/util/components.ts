export const createIcon = (name: string, type: string = "bi") => {
    const iconEl = document.createElement("i")

    iconEl.classList.add(`${type}-${name}`)
    iconEl.setAttribute("icon", "")

    return iconEl
}

export const getRouter = async (route: string, callback: (data: string) => void, onerror = (err: unknown) => { }) => {
    try {
        const response = await fetch(route)
        const data = await response.text()

        callback(data)
    } catch (error) {
        onerror(error)
    }
}