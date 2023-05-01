import { createIcon } from "../../util/components.js"

export function SelectionGroupComponent(
    form: HTMLElement,
    props: {
        actions: TOptionSelectionForm[],
        options: TOptionSelection[],
        submenu?: any[],
        isParent?: boolean,
        updateList?: boolean,
        classBox: string,
        listeners?: {
            onUpdate?: () => void
        }
    },
    pre?: TOptionSelectionForm[]
) {

    const MAP_OPTIONS: { type: TOptionSelectionForm, icon: string, _action: string, content: string }[] = [
        { type: "_newOne", icon: "plus-lg", _action: "_new", content: "Novo" },
        { type: "_newAll", icon: "list-ul", _action: "_new", content: "Adicionar Tudo" },
        { type: "_clear", icon: "x-lg", _action: "_cancel", content: "Limpar" },
    ]

    const listSelected: { value: string, subMenu?: any[] }[] = []

    if (typeof props.isParent == "undefined") { props.isParent = true }
    if (typeof props.submenu == "undefined") { props.submenu = [] }
    if (typeof props.updateList == "undefined") { props.updateList = true }

    const updateListSelected = () => {
        if (!props.updateList) { return props.listeners && props.listeners && props.listeners.onUpdate && props.listeners.onUpdate() }

        const listEl = form.querySelectorAll("." + props.classBox + ".parent") as NodeListOf<HTMLElement>

        console.log({ listEl })

        listSelected.splice(0, listSelected.length)

        listEl.forEach(_el => {
            const listSubEl = _el.querySelectorAll("." + props.classBox + ".children") as NodeListOf<HTMLElement>
            const select = _el.querySelector("select") as HTMLSelectElement

            const listSub: { value: string }[] = []

            listSubEl.forEach(_elSub => {
                const selectSub = _elSub.querySelector("select") as HTMLSelectElement

                const valueSub = selectSub?.value || ""

                listSub.push({ value: valueSub })
            })

            const value = select?.value || ""

            listSelected.push({ value, subMenu: listSub })
        })

        props.listeners && props.listeners && props.listeners.onUpdate && props.listeners.onUpdate()
    }

    const MAP_OPTIONS_FUNCTION = {
        "_newOne": (actionProcessActive: string = "") => {
            const box = document.createElement("div")
            const list = form.querySelector(".select-group-list") as HTMLElement

            box.classList.add(props.classBox, props.isParent ? "parent" : "children")

            const selectionContent = document.createElement("div")
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

            selectionContent.classList.add(props.classBox + "-container")

            btRemove.setAttribute("action", "_default")
            selectionProcess.onchange = updateListSelected
            btRemove.onclick = () => {
                box.remove()
                updateListSelected()
            }

            btRemove.appendChild(iconRemove)
            selectionContent.appendChild(selectionProcess)
            selectionContent.appendChild(btRemove)
            box.appendChild(selectionContent)
            list.appendChild(box)
            props.submenu && props.submenu.length > 0 && box.appendChild(createSubMenu(props.submenu))

            updateListSelected()
        },
        "_newAll": () => {
            props.options.forEach(_option => {
                MAP_OPTIONS_FUNCTION["_newOne"](_option.action)
            })

            updateListSelected()
        },
        "_clear": () => {
            const listEl = form.querySelectorAll("." + props.classBox) as NodeListOf<HTMLElement>

            listEl.forEach(_el => _el.remove())

            updateListSelected()
        }
    }

    const createContainerActions = () => {
        const container = document.createElement("div")

        container.setAttribute("button-container", "")
        container.classList.add("select-group-actions")

        MAP_OPTIONS.forEach(_option => {
            if (!props.actions.includes(_option.type)) { return }

            const bt = document.createElement("button")
            const iconEl = createIcon(_option.icon)
            const span = document.createElement("span")

            bt.onclick = () => MAP_OPTIONS_FUNCTION[_option.type]()

            bt.setAttribute("action", _option._action)
            span.textContent = _option.content

            bt.appendChild(iconEl)
            bt.appendChild(span)
            container.appendChild(bt)
        })

        form.appendChild(container)
    }

    const createListOptions = () => {
        const list = document.createElement("div")

        list.setAttribute("list-type", "vertical")
        list.classList.add("select-group-list", props.isParent ? "parent" : "children")

        form.appendChild(list)
    }

    const createSubMenu = (subMenus: any[]) => {
        const subMenu = document.createElement("div")

        subMenu.classList.add("sub-menu")

        SelectionGroupComponent(subMenu, { actions: props.actions, options: subMenus, isParent: false, updateList: false, classBox: props.classBox, listeners: { onUpdate: updateListSelected } }, [])

        return subMenu
    }

    const setup = () => {
        createContainerActions()
        createListOptions()

        pre && pre.forEach(_preFunc => MAP_OPTIONS_FUNCTION[_preFunc]())
    }

    setup()

    return {
        listSelected
    }
}