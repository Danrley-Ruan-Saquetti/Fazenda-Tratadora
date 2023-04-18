function PanelControl() {
    const modelWindowControl = ModelWindowControl()
    const routerControl = RouterControl()

    let panelList: HTMLElement
    let abaList: HTMLElement

    let panelActive: string | null = null

    const initComponents = (listPanel: HTMLElement, listAba: HTMLElement) => {
        panelList = listPanel
        abaList = listAba
    }

    // Panel
    const createPanel = (id: string, name: string, parent: HTMLElement, callback: (panel: HTMLElement | null) => void) => {
        if (!name) { return null }

        const panelEl = document.createElement("div")

        panelEl.setAttribute("id", `${id}`)
        panelEl.setAttribute("panel", `${name}`)
        panelEl.setAttribute("model-window-parent", "")

        loadPanel(panelEl, id, name, parent, (res) => {
            if (!res) { return callback(null) }

            callback(panelEl)
        })
    }

    const newPanel = ({ name, title }: { name: TRouterName, title: string }, isCtrl: boolean) => {
        if (!isCtrl && getPanelByName(name)) { return }

        const id = generatedId()

        const { bt: btCloseAba, el: abaEl } = createAba(title, id)

        createPanel(id, name, panelList, (panel) => {
            if (!isCtrl) { togglePanel(id) }

            abaEl.addEventListener("mousedown", (ev) => ev.button == 1 && removePanelModel(id))

            abaEl.addEventListener("click", () => togglePanel(id))

            btCloseAba.addEventListener("click", () => removePanelModel(id))
        })

    }

    const loadPanel = (panel: HTMLElement, id: string, name: string, parent: HTMLElement, callback: (res: boolean) => void) => {
        const responseRouter = routerControl.getRouter({ name })

        if (!responseRouter) {
            panel.innerHTML = GLOBAL_ROUTER_NOT_FOUND
        } else {
            const { router, script } = responseRouter

            routerControl.query({ router }, ({ data, error }) => {
                if (!data || error) {
                    panel.innerHTML = error?.msg || GLOBAL_ROUTER_NOT_FOUND
                    return callback(false)
                }
                if (!GLOBAL_MODULE_SCRIPTS[`${script}`]) {
                    panel.innerHTML = "Cannot load page"
                    return callback(false)
                }

                panel.innerHTML = data

                parent.appendChild(panel)

                if (GLOBAL_MODULE_SCRIPTS[`${script}`](id).error) {
                    panel.innerHTML = GLOBAL_ROUTER_NOT_FOUND

                    return callback(false)
                }

                callback(true)
            })
        }

        return true
    }

    const removePanelModel = (id: string) => {
        removeAba(id)
        removePanel(id)
    }

    const showPanel = (id: string) => {
        const panel = getPanel(id)

        if (!panel) { return }

        panel.classList.toggle("active", true)
        panelActive = id
    }

    const hiddenPanel = (id: string) => {
        const panel = getPanel(id)

        if (!panel) { return }

        panel.classList.toggle("active", false)
    }

    const removePanel = (id: string) => {
        const panel = getPanel(id)

        if (!panel) { return false }

        const nextPanel = panel.previousElementSibling as HTMLElement

        if (panelActive == id) {
            const nextId = nextPanel ? nextPanel.getAttribute("id") || "" : ""

            if (nextId) {
                togglePanel(nextId)
            } else {
                panelActive = null
            }
        }

        panel.remove()
        return true
    }

    const getPanel = (id: string) => {
        const panel = panelList.querySelector(`[panel][id="${id}"]`) as HTMLElement | null

        return panel
    }

    const getPanelByName = (name: string, id?: string) => {
        const panel = document.querySelector(`[panel="${name}"]${id ? `[id="${id}"]` : ``}`)

        return panel
    }

    const togglePanel = (id: string) => {
        if (!getPanel(id)) { return }

        const panels = panelList.querySelectorAll("[panel]") as NodeListOf<HTMLElement>

        panels.forEach(_panel => {
            hiddenPanel(_panel.getAttribute("id") || "")
        })

        showPanel(id)
        activeAba(id)
    }

    // Aba
    const createAba = (title: string, idPanel: string) => {
        const abaEl = document.createElement("div")
        const spanTitle = document.createElement("span")
        const btClose = document.createElement("button")
        const iconEl = createIcon("x")

        spanTitle.textContent = title

        spanTitle.classList.add("aba-title")

        abaEl.setAttribute("aba", `${idPanel}`)

        abaEl.classList.add("aba")

        btClose.title = "Fechar aba"

        btClose.appendChild(iconEl)
        abaEl.appendChild(spanTitle)
        abaEl.appendChild(btClose)

        abaList.appendChild(abaEl)

        return { el: abaEl, bt: btClose }
    }

    const getAba = (id: string) => {
        const aba = abaList.querySelector(`[aba="${id}"]`) as HTMLElement | null

        return aba
    }

    const removeAba = (id: string) => {
        const aba = getAba(id)

        if (!aba) { return }

        aba.remove()
    }

    const activeAba = (id: string) => {
        const aba = getAba(id)

        if (!aba) { return }

        const abas = abaList.querySelectorAll(`[aba]`) as NodeListOf<HTMLElement>

        abas.forEach(_aba => _aba.classList.toggle("active", false))

        aba.classList.toggle("active", true)
    }

    return {
        initComponents,
        newPanel,
    }
}