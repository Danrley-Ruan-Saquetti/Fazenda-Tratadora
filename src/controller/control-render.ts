function RenderControl() {
    const historyTableControl = HistoryTableControl()
    const mainControl = MainControl()
    const panelControl = PanelControl()
    const modelWindow = ModelWindowComponent()

    const ELEMENTS = {
        sideBarList: document.querySelector(".side-bar [list]") as HTMLElement,
        panelControl: document.querySelector(".panel-control") as HTMLElement,
        abaContentList: document.querySelector(".abas") as HTMLElement,
        listFarms: document.querySelector(".list.farms") as HTMLElement
    }

    const initComponents = () => {
        panelControl.initComponents(ELEMENTS.panelControl, ELEMENTS.abaContentList)

        GLOBAL_ROUTERS.forEach(_item => {
            if (GLOBAL_DEPENDENCE != "development") {
                if (_item.__dev) { return }

                if (!_item.active) { return }
            }

            const itemEl = createItem(_item.title, _item.icon, _item.name, _item.active)

            itemEl.addEventListener("click", (ev) => {
                const panelAlreadyExist = panelControl.getPanelByName(_item.name)

                if (!ev.ctrlKey && panelAlreadyExist) {
                    const id = panelAlreadyExist.getAttribute("id")

                    return id && panelControl.togglePanel(id)
                }

                panelControl.newPanel(_item, ev.ctrlKey)
            })

            GLOBAL_ROUTERS_OPEN.includes(_item.name) && panelControl.newPanel(_item, false)

            ELEMENTS.sideBarList.appendChild(itemEl)
        })
    }

    // Side Bar
    // - Item
    const createItem = (title: string, icon: string, name: string, active: boolean) => {
        const itemEl = document.createElement("div")
        const span = document.createElement("span")
        const iconEl = createIcon(icon)

        itemEl.setAttribute("item", name)
        itemEl.setAttribute("icon-parent", "")
        itemEl.classList.add("item")

        span.classList.add("item-title")
        span.textContent = title

        itemEl.appendChild(iconEl)
        itemEl.appendChild(span)

        if (!active) {
            const iconDisabledEl = createIcon("eye-slash")

            itemEl.appendChild(iconDisabledEl)
        }

        return itemEl
    }

    return {
        initComponents,
    }
}