function FeatureScript(idPanel: string) {
    const panel = document.querySelector(`[panel="feature"][id="${idPanel}"]`) as HTMLElement

    if (!panel) { return { error: { msg: "Panel not found" } } }

    const ELEMENTS = {
        selectFormPlants: document.querySelector(".select-form.plants") as HTMLElement,
        selectFormProcess: document.querySelector(".select-form.process") as HTMLElement,
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
            { content: "CEP de Origem Inicial", type: "cep.origin.initial" },
            { content: "CEP de Origem Final", type: "cep.origin.final" },
            { content: "CEP Inicial", type: "cep.initial" },
            { content: "CEP Final", type: "cep.final" },
            { content: "Critério de Seleção", type: "selection-criteria" },
            { content: "Prazo", type: "deadline" },
            { content: "D+1", type: "deadline+d" },
            { content: "Excedente", type: "excess" },
            { content: "Taxa", type: "rate" },
        ]
    }

    const MAP_SELECTION_PLANTS: TOptionSelection[] = [
        { action: "farm", content: "Fazenda", type: "farm" },
        { action: "deadline", content: "Prazo", type: "deadline" },
        { action: "price", content: "Preço", type: "price" },
    ]

    const MAP_SELECTION_PROCESS: TOptionSelection[] = [
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

    const initComponents = () => {
        const { listSelected: listPlants } = SelectionFormComponent(ELEMENTS.selectFormPlants, { events: { _newOne: createBoxSelection }, options: MAP_SELECTION_PLANTS, submenu: [...MAP_PARAMS["plants"]] })
        const { listSelected: listProcess } = SelectionFormComponent(ELEMENTS.selectFormProcess, { events: { _newOne: createBoxSelection }, options: MAP_SELECTION_PROCESS }, ["_newAll"])

        function createBoxSelection() {
            const box = document.createElement("div") as HTMLElement

            box.classList.add("box")

            return box
        }
    }

    initComponents()

    return {}
}
