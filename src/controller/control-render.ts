function RenderControl() {
    const historyTableControl = HistoryTableControl()
    const mainControl = MainControl()
    const panelControl = PanelControl()
    const modelWindowControl = ModelWindowControl()

    const ELEMENTS = {
        sideBarList: document.querySelector(".side-bar [list]") as HTMLElement,
        panelControl: document.querySelector(".panel-control") as HTMLElement,
        abaContentList: document.querySelector(".abas") as HTMLElement,
        listFarms: document.querySelector(".list.farms") as HTMLElement
    }

    const initComponents = () => {
        panelControl.initComponents(ELEMENTS.panelControl, ELEMENTS.abaContentList)

        GLOBAL_ROUTES.forEach(_item => {
            const itemEl = createItem(_item.title, _item.icon, _item.name)

            itemEl.addEventListener("click", (ev) => {
                panelControl.newPanel({ name: _item.name, title: _item.title }, ev.ctrlKey)
            })

            _item.name == "farm" && panelControl.newPanel({ name: _item.name, title: _item.title }, false)

            ELEMENTS.sideBarList.appendChild(itemEl)
        })

        // loadListFarms()
    }

    const loadListFarms = () => {
        const { history } = historyTableControl.getHistory()

        if (ELEMENTS.listFarms) { ELEMENTS.listFarms.textContent = "" }

        history && history.forEach(_farm => {
            const div = document.createElement("div")
            const span = document.createElement("span")
            const btDownload = document.createElement("a")
            const btLoad = document.createElement("button")

            btLoad.textContent = "Carregar"

            btLoad.onclick = () => {
                mainControl.loadFarm(_farm.id)
                mainControl.prepareForDownload()
            }

            mainControl.createURLDownload((url, zipName) => {
                btDownload.setAttribute("href", url)
                btDownload.setAttribute("download", `Teste Histórico - ${_farm.id} ${_farm.data.name} ${zipName}`)
            }, _farm.data.tables.map(_f => { return { file: _f.table, name: _f.name } }))

            btDownload.textContent = "Download"

            span.textContent = _farm.id + ": " + _farm.date + (_farm.parent ? " Parent: " + _farm.parent : "")

            div.appendChild(span)
            div.appendChild(btDownload)
            div.appendChild(btLoad)

            ELEMENTS.listFarms?.appendChild(div)
        })
    }

    // Side Bar
    // - Item
    const createItem = (title: string, icon: string, name: string) => {
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

        return itemEl
    }

    return {
        initComponents,
        loadListFarms,
    }
}