function PanelControl() {
    type IRouterWithouIcon = Pick<TItemRoute, 'router' | 'script' | "name" | "title"> & Partial<Pick<TItemRoute, 'icon'>>;

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
    const createPanel = (id: string, name: string, callback?: (res: boolean, panel: HTMLElement | null) => void) => {
        if (!name) { return callback && callback(false, null) }

        const create = (data: string) => {
            const panelEl = document.createElement("div")

            panelEl.innerHTML = data

            panelEl.setAttribute("id", `${id}`)
            panelEl.setAttribute("panel", `${name}`)
            panelEl.setAttribute("model-window-parent", "")

            callback && callback(true, panelEl)
        }

        const router = routerControl.getRouter({ name })

        if (!router) {

            return
        }

        getRouter(router.router, create, (err) => {
            console.log(err)
            callback && callback(false, null)
        })
    }

    const newPanel = ({ name, title }: { name: TRouterName, title: string }, isCtrl: boolean, callback?: () => void) => {
        if (!isCtrl && getPanelByName(name)) { return }

        const id = generatedId()

        const { bt: btCloseAba, el: abaEl } = createAba(title, id)

        createPanel(id, name, (res, panel) => {
            if (!res || !panel) { return }

            addPanel(panel)

            if (!GLOBAL_MODULE_SCRIPTS[script]) {
                getRouter("routes/panel-404.html", (res) => {
                    panel.innerHTML = res
                })
            } else {
                const response = GLOBAL_MODULE_SCRIPTS[script](id)

                if (response.error) {
                    getRouter("routes/panel-404.html", (res) => {
                        panel.innerHTML = res
                    })
                }
            }

            if (!isCtrl || !getPanelByName(name)) { togglePanel(id) }

            callback && callback()
        })

        abaEl.addEventListener("mousedown", (ev) => ev.button == 1 && removePanelModel(id))

        abaEl.addEventListener("click", () => togglePanel(id))

        btCloseAba.addEventListener("click", () => removePanelModel(id))
    }

    const removePanelModel = (id: string) => {
        removeAba(id)
        removePanel(id)
    }

    const addPanel = (panel: HTMLElement) => {
        panelList.appendChild(panel)
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

    const getPanelByName = (name: string) => {
        const panel = panelList.querySelector(`[panel="${name}"]`)

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