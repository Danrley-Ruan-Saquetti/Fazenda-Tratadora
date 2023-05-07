function ModelWindowComponent() {

    const createModel = (children: HTMLElement, title: string = "", move: boolean = true) => {
        const model = document.createElement("div")
        const modelBody = document.createElement("div")

        model.setAttribute("model-window", "enabled")
        modelBody.setAttribute("model-body", "")

        setupModel(model, title, move)

        modelBody.appendChild(children)
        model.appendChild(modelBody)

        model.style.width = "100%"
        model.style.height = "450px"
        model.style.top = "20px"
        model.style.left = "50%"
        model.style.transform = "translateX(-50%)"

        return model
    }

    const setupModel = (model: HTMLElement, title: string, move: boolean = true) => {
        const headerModel = document.createElement("div")
        const titleEl = document.createElement("span")
        const btClose = document.createElement("button")

        titleEl.innerHTML = title

        headerModel.classList.add("model-header")
        btClose.onclick = () => closeModel(model)

        btClose.appendChild(createIcon("x-lg"))
        headerModel.appendChild(titleEl)
        headerModel.appendChild(btClose)

        model.appendChild(headerModel)

        move && activeMoveModel(headerModel, model)
        openModel(model)
    }

    const activeMoveModel = (header: HTMLElement, model: HTMLElement) => {
        let mouseX: number, mouseY: number, elementX: number, elementY: number

        let isPressed = false

        const move = (ev: MouseEvent) => {
            if (!isPressed) { return }

            const parent = model.parentElement

            const deltaX = ev.clientX - mouseX
            const deltaY = ev.clientY - mouseY
            const newElementX = elementX + deltaX
            const newElementY = elementY + deltaY

            const width = model.clientWidth
            const height = model.clientHeight

            const x = newElementX <= 0 ? 0 : parent ? newElementX + width >= parent.clientWidth ? parent.clientWidth - width : newElementX : newElementX
            const y = newElementY <= 0 ? 0 : parent ? newElementY + height >= parent.clientHeight ? parent.clientHeight - height : newElementY : newElementY

            model.style.left = x + "px"
            model.style.top = y + "px"
            model.style.transform = "none"
        }

        header.addEventListener("mousedown", (ev) => {
            ev.preventDefault()

            if (model.getAttribute("model-window") != "enabled") { return }

            mouseX = ev.clientX
            mouseY = ev.clientY
            elementX = model.offsetLeft
            elementY = model.offsetTop

            isPressed = true
        })

        window.addEventListener("mouseup", () => {
            isPressed = false
        })

        window.addEventListener("mousemove", move)

        header.style.cursor = "move"
    }

    const openModel = (model: HTMLElement) => {
        model.setAttribute("model-window", "enabled")
        const headerModel = model.querySelector(".header") as HTMLElement

        if (!headerModel) { return }
    }

    const closeModel = (model: HTMLElement) => {
        model.remove()
    }

    return {
        createModel,
        activeMoveModel
    }
}