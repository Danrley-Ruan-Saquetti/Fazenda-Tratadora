function HistoryScript(idPanel: string) {
    const panel = document.querySelector(`[panel="history"][id="${idPanel}"]`) as HTMLElement

    if (!panel) { return { error: { msg: "Panel not found" } } }

    const mainControl = MainControl()
    const renderControl = RenderControl()
    const historyControl = HistoryTableControl()

    const HEADERS_TABLE = [{ header: "id" }, { header: "parent" }, { header: "name" }, { header: "date" }]

    const ELEMENTS = {
        tableHistory: panel.querySelector('[table="history"]') as HTMLElement,
        btLoadTable: panel.querySelector('.load-table') as HTMLElement,
    }

    const initComponents = () => {
        ELEMENTS.btLoadTable.addEventListener("click", loadTableHistory)

        renderControl.loadHeaderTable(ELEMENTS.tableHistory, HEADERS_TABLE)

        loadTableHistory()
    }

    const loadTableHistory = () => {
        const { history } = historyControl.getHistory()

        const body = ELEMENTS.tableHistory.querySelector("[table-data]") as HTMLElement

        body.innerHTML = ""

        const data = history.map(_farm => { return { name: _farm.data.name, date: _farm.date, id: _farm.id, parent: _farm.parent } })

        renderControl.loadDataTable(body, HEADERS_TABLE, data)
    }

    initComponents()

    return {}
}