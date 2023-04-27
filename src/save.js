// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta http-equiv="X-UA-Compatible" content="IE=edge">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Document</title>
// </head>
// <body>

//     <form action="">
//         <div class="selection-group-container">

//         </div>
//     </form>

//     <script src="selection-group.js"></script>
//     <script src="app.js"></script>

//     <script>
//         document.querySelector("form").onsubmit = ev => ev.preventDefault()
//     </script>
// </body>
// </html>

///////////////////////////////////////////

function App() {
    const ELEMENTS = {
        selectionGroupContainer: document.querySelector(".selection-group-container")
    }

    const MAP_PARAMS = {
        process: {
            "create-farm": [],
            "insert-values": [],
            "deadline+D": [],
            "contained-cep": [],
            "procv": [],
            "template": [],
            "rate": [],
        },
        plants: [
            { content: "CEP de Origem Inicial", type: "cep.origin.initial", action: "cep.origin.initial" },
            { content: "CEP de Origem Final", type: "cep.origin.final", action: "cep.origin.final" },
            { content: "CEP Inicial", type: "cep.initial", action: "cep.initial" },
            { content: "CEP Final", type: "cep.final", action: "cep.final" },
            { content: "Critério de Seleção", type: "selection-criteria", action: "selection-criteria" },
            { content: "Prazo", type: "deadline", action: "deadline" },
            { content: "D+1", type: "deadline+d", action: "deadline+d" },
            { content: "Excedente", type: "excess", action: "excess" },
            { content: "Taxa", type: "rate", action: "rate" },
        ]
    }

    const MAP_SELECTION_PLANTS = [
        { action: "farm", content: "Fazenda", type: "farm" },
        { action: "deadline", content: "Prazo", type: "deadline" },
        { action: "price", content: "Preço", type: "price" },
    ]

    const MAP_SELECTION_PROCESS = [
        {
            content: "Criar Fazenda",
            type: "process",
            action: "create-farm",
            submenu: [...MAP_PARAMS["process"]["create-farm"]]
        },
        {
            content: "Inserir valores",
            type: "process",
            action: "insert-values",
            submenu: [...MAP_PARAMS["process"]["insert-values"]]
        },
        {
            content: "D+1",
            type: "process",
            action: "deadline+D",
            submenu: [...MAP_PARAMS["process"]["deadline+D"]]
        },
        {
            content: "Verificar CEP contido",
            type: "process",
            action: "contained-cep",
            submenu: [...MAP_PARAMS["process"]["contained-cep"]]
        },
        {
            content: "Procv",
            type: "process",
            action: "procv",
            submenu: [...MAP_PARAMS["process"]["procv"]]
        },
        {
            content: "Gerar templates de Preço e Prazo",
            type: "process",
            action: "template",
            submenu: [...MAP_PARAMS["process"]["template"]]
        },
        {
            content: "Gerar templates de taxas",
            type: "process",
            action: "rate",
            submenu: [...MAP_PARAMS["process"]["rate"]]
        },
    ]

    SelectionFormComponent(ELEMENTS.selectionGroupContainer, { events: { _newOne: createBoxSelection, _newChildren: createBoxSelectionChildren },isParent: true, updateList: true, options: MAP_SELECTION_PLANTS, submenu: [...MAP_PARAMS["plants"]] }, ["_newAll"])
}

function createBoxSelection() {
    const box = document.createElement("div")

    box.classList.add("box", "parent")

    return box
}

function createBoxSelectionChildren() {
    const box = document.createElement("div")

    box.classList.add("box", "children")

    return box
}

window.onload = App

////////////////////////////////////////

function SelectionFormComponent(form, props = {
    events: { _newOne, _newAll: () => {}, _clear: () => {}, _newChildren, _update: () => {return []} },
    options: [],
    submenu: [],
    isParent: true,
    updateList: true
}, pre = []) {
    const MAP_OPTIONS = [
        { type: "_newOne", icon: "plus-lg", _action: "_new", content: "Novo" },
        { type: "_newAll", icon: "list-ul", _action: "_new", content: "Adicionar Tudo" },
        { type: "_clear", icon: "x-lg", _action: "_cancel", content: "Limpar" },
    ]

    const listSelected = []

    const updateListSelected = () => {
        if (!props.updateList) {return props.events._update && props.events._update()}
    
        const listEl = form.querySelectorAll(".box.parent")
        
        listSelected.splice(0, listSelected.length)

        listEl.forEach(_el => {
            const listSubEl = _el.querySelectorAll(".box.children")
            const select = _el.querySelector("select")

            const listSub = []

            listSubEl.forEach(_elSub => {
                const selectSub = _elSub.querySelector("select")
                
                const valueSub = selectSub?.value || ""

                listSub.push({value: valueSub})    
            })

            const value = select?.value || ""

            listSelected.push({value, subMenu: listSub})
        })

        props.events._update && props.events._update()
    }

    const MAP_OPTIONS_FUNCTION = {
        "_newOne": (actionProcessActive = "") => {
            const box = props.events._newOne()
            const list = form.querySelector(".selection-form-list")

            const selectionParent = document.createElement("div")
            const btRemove = document.createElement("button")
            const selectionProcess = document.createElement("select")

            props.options.forEach(_option => {
                const option = document.createElement("option")

                option.innerHTML = _option.content
                option.value = _option.action

                if (actionProcessActive == _option.action) { option.selected = true }

                selectionProcess.appendChild(option)
            })

            selectionParent.classList.add("selection-parent")
            btRemove.setAttribute("action", "_default")
            btRemove.innerHTML = "Remover"
            selectionProcess.onchange = () => updateListSelected()
            btRemove.onclick = () => {
                box.remove()
                updateListSelected()
            }

            selectionParent.appendChild(selectionProcess)
            selectionParent.appendChild(btRemove)
            box.appendChild(selectionParent)
            list.appendChild(box)

            if (props.submenu && props.submenu.length > 0) {
                selectionParent.appendChild(createSubMenu(props.submenu))
            }

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

            const listEl = form.querySelectorAll(".box")

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

            bt.onclick = () => {
                MAP_OPTIONS_FUNCTION[_option.type]()
            }

            bt.setAttribute("action", _option._action)
            span.textContent = _option.content

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

    const createSubMenu = (subMenus) => {
        const subMenu = document.createElement("div")

        subMenu.classList.add("sub-menu")

        SelectionFormComponent(subMenu, {events: {_newOne: props.events._newChildren, _update: updateListSelected}, options: subMenus,isParent: false, updateList: false}, ["_newAll"])

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
