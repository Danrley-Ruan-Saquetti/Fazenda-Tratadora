function FeatureScript(idPanel: string) {
    const panel = document.querySelector(`[panel="feature"][id="${idPanel}"]`) as HTMLElement

    if (!panel) { return { error: { msg: "Panel not found" } } }

    const initComponents = () => {
        const selectContainer = document.querySelector(".select-container")
        const btAdd = document.querySelector(".add-box-selection")
        const btSubmit = document.querySelector(".submit")
        const btAddAll = document.querySelector(".add-all")
        const btClearAll = document.querySelector(".clear-all")
        const list = document.querySelector(".list-box-selection")

        const MAP_PARAMS = {
            process: [],
            settings: []
        }

        const MAP_SELECTION_PROCESS = [
            { 
                content: "Criar Fazenda",
                type: "process",
                action: "create-farm",
                params: [...MAP_PARAMS["process"]] 
            },
            { 
                content: "Inserir valores",
                type: "process",
                action: "insert-values",
                params: [...MAP_PARAMS["process"]] 
            },
            { 
                content: "D+1",
                type: "process",
                action: "deadline+D",
                params: [...MAP_PARAMS["process"]] 
            },
            { 
                content: "Verificar CEP contido",
                type: "process",
                action: "contained-cep",
                params: [...MAP_PARAMS["process"]] 
            },
            { 
                content: "Procv",
                type: "process",
                action: "procv",
                params: [...MAP_PARAMS["process"]] 
            },
            { 
                content: "Gerar templates de Preço e Prazo",
                type: "process",
                action: "template",
                params: [...MAP_PARAMS["process"]] 
            },
            { 
                content: "Gerar templates de taxas",
                type: "process",
                action: "rate",
                params: [...MAP_PARAMS["process"]] 
            },
        ]

        function creatBoxSelection(actionProcessActive = null) {
            const box = document.createElement("div")
            const span = document.createElement("span")
            const btRemove = document.createElement("button")
            const selectionProcess = document.createElement("select")

            MAP_SELECTION_PROCESS.forEach(_process => {
                const option = document.createElement("option")

                option.innerHTML = _process.content
                option.value = _process.action

                if (actionProcessActive == _process.action) {option.selected = true}

                selectionProcess.appendChild(option)
            })

            box.classList.add("box")

            span.textContent = "Hello World"
            btRemove.innerHTML = "DEL"

            btRemove.onclick = () => {
                box.remove()
            }

            box.appendChild(span)
            box.appendChild(selectionProcess)
            box.appendChild(btRemove)
            list.appendChild(box)
        }

        function addAll() {
            MAP_SELECTION_PROCESS.forEach(_process => {
                creatBoxSelection(_process.action)
            })
        }

        function clearAll() {
            const listProcessEl = list.querySelectorAll(".box")

            listProcessEl.forEach(_process => _process.remove())
        }

        function submit() {
            const listProcessEl = list.querySelectorAll(".box")

            const listProcess = []

            listProcessEl.forEach(_process => {
                const process = _process.querySelector("select")

                const value = process.value

                listProcess.push(value)
            })	

            console.log(listProcess)
        }

        btAdd.addEventListener("click", creatBoxSelection)
        btSubmit.addEventListener("click", submit)
        btAddAll.addEventListener("click", addAll)
        btClearAll.addEventListener("click", clearAll)
    }

    initComponents()

    return {}
}
