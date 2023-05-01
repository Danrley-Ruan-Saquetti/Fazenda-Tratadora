import { createIcon } from "../util/components.js"

export function ModelWindowControl() {

    const createModel = (children: HTMLElement) => {
        const model = document.createElement("div")

        model.setAttribute("model-window", "enabled")

        model.appendChild(children)

        setupModel(model)

        return model
    }

    const setupModel = (model: HTMLElement) => {
        const headerModel = document.createElement("div")
        const btClose = document.createElement("button")

        btClose.onclick = () => closeModel(model)

        btClose.appendChild(createIcon("x"))
        headerModel.appendChild(btClose)

        headerModel.classList.add("header")

        model.insertBefore(headerModel, model.firstChild)

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
        model.setAttribute("model-window", "disabled")
    }

    return {
        createModel
    }
}