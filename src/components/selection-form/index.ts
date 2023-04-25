function SelectionFormComponent(form: HTMLElement, props: {
    events: { _newOne: () => HTMLElement, _newAll?: () => void, _clear?: () => void, },
    options: TOptionSelection[],
    submenu?: any[]
}, pre?: TOptionSelectionForm[]) {
    const MAP_OPTIONS: { type: TOptionSelectionForm, icon: string, _action: string, content: string }[] = [
        { type: "_newOne", icon: "plus-lg", _action: "_new", content: "Novo" },
        { type: "_newAll", icon: "list-ul", _action: "_new", content: "Adicionar Tudo" },
        { type: "_clear", icon: "x-lg", _action: "_cancel", content: "Limpar" },
    ]

    const listSelected: string[] = []

    const updateListSelected = () => {
        const listEl = form.querySelectorAll(".box") as NodeListOf<HTMLElement>

        listSelected.splice(0, listSelected.length)

        listEl.forEach(_el => {
            const select = _el.querySelector("select")

            const value = select?.value || ""

            listSelected.push(value)
        })
    }

    const MAP_OPTIONS_FUNCTION = {
        "_newOne": (actionProcessActive: string = "") => {
            const box = props.events._newOne()
            const list = form.querySelector(".selection-form-list") as HTMLElement

            const btRemove = document.createElement("button")
            const selectionProcess = document.createElement("select")
            const iconRemove = createIcon("dash")

            props.options.forEach(_option => {
                const option = document.createElement("option")

                option.innerHTML = _option.content
                option.value = _option.action

                if (actionProcessActive == _option.action) { option.selected = true }


                selectionProcess.appendChild(option)
            })

            if (props.submenu && props.submenu.length > 0) {
                box.appendChild(createSubMenu(props.submenu))
            }

            btRemove.setAttribute("action", "_default")
            selectionProcess.onchange = updateListSelected
            btRemove.onclick = () => {
                box.remove()
                updateListSelected()
            }

            btRemove.appendChild(iconRemove)
            box.appendChild(selectionProcess)
            box.appendChild(btRemove)
            list.appendChild(box)

            updateListSelected()
        },
        "_newAll": () => {
            props.events?._newAll && props.events._newAll()

            props.options.forEach(_option => {
                MAP_OPTIONS_FUNCTION["_newOne"](_option.action)
            })

            updateListSelected()
        },
        "_clear": () => {
            props.events?._clear && props.events._clear()

            const listEl = form.querySelectorAll(".box") as NodeListOf<HTMLElement>

            listEl.forEach(_el => _el.remove())

            updateListSelected()
        }
    }

    const createContainerOptions = () => {
        const container = document.createElement("div")

        container.setAttribute("button-container", "")

        MAP_OPTIONS.forEach(_option => {
            const bt = document.createElement("button")
            const span = document.createElement("span")
            const icon = createIcon(_option.icon)

            bt.onclick = () => {
                MAP_OPTIONS_FUNCTION[_option.type]()
            }

            bt.setAttribute("action", _option._action)
            span.textContent = _option.content

            bt.appendChild(icon)
            bt.appendChild(span)
            container.appendChild(bt)
        })

        form.appendChild(container)
    }

    const createListOptions = () => {
        const list = document.createElement("div")

        list.setAttribute("list-type", "vertical")
        list.classList.add("selection-form-list")

        form.appendChild(list)
    }

    const createSubMenu = (subMenus: any[]) => {
        const subMenu = document.createElement("div")
        const selectSubMenu = document.createElement("select")

        subMenu.classList.add("sub-menu")

        subMenus.forEach(_sm => {
            const option = document.createElement("option")

            option.textContent = _sm.content
            option.value = _sm.type

            selectSubMenu.appendChild(option)
        })

        subMenu.appendChild(selectSubMenu)

        return subMenu
    }

    const setup = () => {
        createContainerOptions()
        createListOptions()

        pre && pre.forEach(_preFunc => MAP_OPTIONS_FUNCTION[_preFunc]())
    }

    setup()

    return {
        listSelected
    }
}