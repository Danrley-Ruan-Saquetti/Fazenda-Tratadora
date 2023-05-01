import { SelectionGroupComponent } from "../components/selection-group/index.js"
import { PreloadPanel } from "./preload.js"

export function FeatureScript(idPanel: string) {
    const panel = document.querySelector(`[panel="feature"][id="${idPanel}"]`) as HTMLElement

    if (!panel) { return { error: { msg: "Panel not found" } } }

    const ELEMENTS = {
        selectGroupPlants: panel.querySelector(".select-group.plants") as HTMLElement,
        selectGroupProcess: panel.querySelector(".select-group.process") as HTMLElement,
        btUpload: panel.querySelector("#upload-files-plant") as HTMLElement
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
            { content: "Prazo+D", type: "deadline+d", action: "deadline+d" },
            { content: "Excedente", type: "excess", action: "excess" },
            { content: "Taxa", type: "rate", action: "rate" },
        ]
    }

    const MAP_SELECTION_PLANTS: TOptionSelection[] = [
        { action: "deadline", content: "Prazo", type: "deadline" },
        { action: "price", content: "Preço", type: "price" },
        { action: "farm", content: "Fazenda", type: "farm" },
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
        PreloadPanel(panel)

        const { listSelected: listPlants } = SelectionGroupComponent(ELEMENTS.selectGroupPlants, { actions: ["_newOne", "_newAll", "_clear"], options: MAP_SELECTION_PLANTS, submenu: [...MAP_PARAMS["plants"]], classBox: "box" }, [])
        const { listSelected: listProcess } = SelectionGroupComponent(ELEMENTS.selectGroupProcess, { actions: ["_newOne", "_newAll", "_clear"], classBox: "box", options: MAP_SELECTION_PROCESS }, [])

        ELEMENTS.btUpload.addEventListener("click", () => {
            console.log(listPlants, listProcess)
        })
    }

    initComponents()

    return {}
}
