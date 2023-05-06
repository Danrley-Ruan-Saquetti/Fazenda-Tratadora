function ModelWindowComponent() {

    const createModel = (children: HTMLElement, title: string = "") => {
        const model = document.createElement("div")
        const modelBody = document.createElement("div")

        model.setAttribute("model-window", "enabled")
        modelBody.setAttribute("model-body", "")

        setupModel(model, title)

        modelBody.appendChild(children)
        model.appendChild(modelBody)

        return model
    }

    const setupModel = (model: HTMLElement, title: string) => {
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

        setupMoveModel(headerModel, model)
        openModel(model)
    }

    const setupMoveModel = (header: HTMLElement, model: HTMLElement) => {
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
        setupMoveModel
    }
}