export function tableComponent({ table: tableEl, headers }: { table: HTMLElement, headers: ITableData[] }, onSelection: (listSelected: string[]) => void, colResizableProps: { liveDrag?: Boolean, resizeMode?: string, minWidth?: number, headerOnly?: Boolean, hoverCursor?: string, dragCursor?: string, onResize: () => void } = { dragCursor: "ew-resize", headerOnly: true, hoverCursor: "ew-resize", liveDrag: true, resizeMode: 'fit', minWidth: 64, onResize: () => { } }) {
    const listSelected: string[] = []

    const insertColumnSelect = () => {
        headers.unshift({ content: "<i class=\"bi-check2-square bt bt-select-all-data\" icon></i>", header: "_data-select", "data-select": "<input type=\"checkbox\"></input>" })
    }

    const updateListSelected = (id: string, isCtrl: boolean, saveOld = false) => {
        const idAlreadyExist = listSelected.find(_id => { return _id == id })

        if (!isCtrl) {
            listSelected.splice(0, listSelected.length)

            if (!idAlreadyExist) {
                listSelected.push(id)
            }
        } else {
            if (idAlreadyExist) {
                const index = listSelected.indexOf(idAlreadyExist)

                if (!saveOld) {
                    index >= 0 && listSelected.splice(index, 1)
                }
            } else {
                listSelected.push(id)
            }
        }
    }

    const activeDataSelected = () => {
        const linesSelected = tableEl.querySelectorAll("tr[data-id].selected") as NodeListOf<HTMLElement>

        linesSelected.forEach(_l => {
            const input = _l.querySelector(`input[type="checkbox"]`) as HTMLInputElement

            if (input) {
                input.checked = false
            }

            _l.classList.remove("selected")
        })

        listSelected.forEach(id => {
            const data = tableEl.querySelector(`tr[data-id="${id}"]`) as HTMLElement
            const input = data.querySelector(`input[type="checkbox"]`) as HTMLInputElement

            if (!data || !input) { return }

            input.checked = true

            data.classList.toggle("selected", true)
        })
    }

    const selectAllData = () => {
        const dataList = tableEl.querySelectorAll("tr[data-id]") as NodeListOf<HTMLElement>

        const saveOld = !(dataList.length == listSelected.length)

        dataList.forEach(_data => {
            const id = _data.getAttribute("data-id")

            id && updateListSelected(id, true, saveOld)
        })

        activeDataSelected()
        onSelection(listSelected)
    }

    const addEventSelect = (el: HTMLElement, id: string) => {
        el.addEventListener("click", ({ ctrlKey: isCtrl }) => {
            updateListSelected(id, isCtrl)
            activeDataSelected()

            onSelection(listSelected)
        })
    }

    const loadHeaderTable = () => {
        const header = document.createElement("thead")
        const body = document.createElement("tbody")

        header.setAttribute("table-header", "")
        body.setAttribute("table-data", "")

        const lineHeader = document.createElement("tr")

        headers.forEach(_header => {
            const cell = document.createElement("th")

            cell.innerHTML = _header.content

            if (_header["data-select"]) {
                cell.setAttribute("data-table-select", "")
                const inputSelectAll = cell.querySelector(".bt-select-all-data") as HTMLElement

                inputSelectAll && inputSelectAll.addEventListener("click", selectAllData)
            }

            lineHeader.appendChild(cell)
        })

        header.appendChild(lineHeader)

        tableEl.appendChild(header)
        tableEl.appendChild(body)
    }

    const loadDataTable = (data: any[]) => {
        const body = tableEl.querySelector("[table-data]") as HTMLElement

        if (data.length == 0) {
            const cell = document.createElement("th")

            cell.setAttribute("colspan", `${headers.length}`)

            cell.textContent = "Nenhum resultado encontrado"

            return body.appendChild(cell)
        }

        body.innerHTML = ""

        data.forEach(_data => {
            const lineData = document.createElement("tr")
            const cell = document.createElement("td")

            if (headers[0]["data-select"]) cell.innerHTML = headers[0]["data-select"]

            lineData.appendChild(cell)

            const headerId = headers.find(_header => { return _header.id })

            lineData.setAttribute("data-id", headerId ? _data[`${headerId.header}`] : "")

            headerId && addEventSelect(lineData, _data[`${headerId.header}`])

            headers.forEach(_header => {
                if (_header["data-select"]) { return }

                const cell = document.createElement("td")

                cell.textContent = _data[`${_header.header}`]

                lineData.appendChild(cell)
            })

            body.appendChild(lineData)
        })
    }

    const colResizable = () => {
        $(document).ready(function () {
            $('[table]').colResizable({
                ...colResizableProps, onResize: function () {
                    $('[table] th:nth-child(1)').css('max-width', '1.75rem')
                    colResizableProps.onResize()
                }
            })
        })
    }

    const setup = () => {
        insertColumnSelect()
        loadHeaderTable()
        colResizable()
    }

    setup()

    return {
        onLoad: loadDataTable
    }
}