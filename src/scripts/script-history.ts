function HistoryScript(idPanel: string) {
    const panel = document.querySelector(`[panel="history"][id="${idPanel}"]`) as HTMLElement

    if (!panel) { return { error: { msg: "Panel not found" } } }

    const mainControl = MainControl()
    const historyControl = HistoryTableControl()

    const HEADERS_TABLE: ITableData[] = [{ header: "id", content: "#", id: true }, { header: "parent", content: "Pai" }, { header: "name", content: "Nome" }, { header: "date", content: "Data" }]

    const ELEMENTS = {
        tableHistory: panel.querySelector('[table="history"]') as HTMLElement,
        btLoadTable: panel.querySelector('.load-table') as HTMLElement,
    }

    const initComponents = () => {
        PreloadPanel(panel)

        const { onLoad } = tableComponent({ table: ELEMENTS.tableHistory, headers: HEADERS_TABLE }, listSelected => { })

        ELEMENTS.btLoadTable.addEventListener("click", () => onLoad(getListHistory()))

        onLoad(getListHistory())
    }

    const getListHistory = () => {
        const { history } = historyControl.getHistory()

        const data = history.map(_farm => { return { name: _farm.data.name, date: _farm.date, id: _farm.id, parent: _farm.parent } })

        return data
    }

    initComponents()

    return {}
}