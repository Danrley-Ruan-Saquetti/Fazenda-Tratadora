function FeatureScript(idPanel: string) {
    const panel = document.querySelector(`[panel="feature"][id="${idPanel}"]`) as HTMLElement

    if (!panel) { return { error: { msg: "Panel not found" } } }

    const notificationControl = NotificationControl(document.querySelector(".list-notification") as HTMLElement)

    const mainControl = MainControl()
    const modelWindow = ModelWindowComponent()

    const ELEMENTS_FORM = {
        selectGroupPlants: panel.querySelector(".select-group.plants") as HTMLElement,
        selectGroupProcess: panel.querySelector(".select-group.process") as HTMLElement,
        btUpload: panel.querySelector("#upload-files-plant") as HTMLElement,
    }

    const dataPlants: { process: TFarmProcessTypeSelection[], settings: ISettingsGeneral } = { process: [], settings: mainControl.getSettings({ storage: true }).settings || mainControl.getSettings().settings || _.cloneDeep(GLOBAL_SETTINGS) }

    const MAP_PARAMS = {
        process: { "create-farm": [], "insert-values": [], "deadline+D": [], "contained-cep": [], procv: [], template: [], rate: [] },
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
        ],
    }

    const MAP_SELECTION_PLANTS: TOptionSelection[] = [
        { action: "deadline", content: "Prazo", type: "deadline" },
        { action: "price", content: "Preço", type: "price" },
        { action: "farm", content: "Fazenda", type: "farm" },
    ]

    const MAP_SELECTION_PROCESS: TOptionSelection[] = [
        { content: "Criar Fazenda", type: "process", action: "create-farm", submenu: [...MAP_PARAMS["process"]["create-farm"]] },
        { content: "Inserir valores", type: "process", action: "insert-values", submenu: [...MAP_PARAMS["process"]["insert-values"]] },
        { content: "D+1", type: "process", action: "deadline+D", submenu: [...MAP_PARAMS["process"]["deadline+D"]] },
        { content: "Verificar CEP contido", type: "process", action: "contained-cep", submenu: [...MAP_PARAMS["process"]["contained-cep"]] },
        { content: "Procv", type: "process", action: "procv", submenu: [...MAP_PARAMS["process"]["procv"]] },
        { content: "Gerar templates de Preço e Prazo", type: "process", action: "template", submenu: [...MAP_PARAMS["process"]["template"]] },
        { content: "Gerar templates de taxas", type: "process", action: "rate", submenu: [...MAP_PARAMS["process"]["rate"]] },
    ]

    const initComponents = () => {
        PreloadPanel(panel)

        const { getData: getListPlants } = SelectionGroupComponent(ELEMENTS_FORM.selectGroupPlants, { templates: { _new: templateSelectionPlantsParent }, basePath: ".box.parent", pathsValue: [{ path: ".box-container.parent", inputs: [{ type: "plant-file", path: 'input[type="file"]' }, { type: "plant-name", path: 'input[type="text"]' }, { type: "plant-type", path: "select" },] }, { path: ".box-container.children", children: true, inputs: [{ type: "header-name", path: 'input[type="text"]' }, { type: "header-type", path: "select" },] },], actions: ["_newOne", "_newAll", "_clear"], options: MAP_SELECTION_PLANTS, classBox: "box", classMenu: ["select-group-list", "parent"] }, ["_newOne"])
        const { getData: getListProcess } = SelectionGroupComponent(ELEMENTS_FORM.selectGroupProcess, { templates: { _new: templateSelectionProcess }, basePath: ".box.parent", pathsValue: [{ path: ".box-container.parent", inputs: [{ path: "select", type: "process" }] }], actions: ["_newOne", "_newAll", "_clear"], classBox: "box", classMenu: ["select-group-list"], options: MAP_SELECTION_PROCESS }, ["_newAll"])

        panel.querySelector("#download-files")?.addEventListener("click", downloadFiles)
        panel.querySelector("#save-farm")?.addEventListener("click", saveFarm)
        panel.querySelector("#get-data")?.addEventListener("click", () => mainControl.getData(idPanel))
        panel.querySelector("#clear-ls")?.addEventListener("click", clearHistory)
        panel.querySelector("#clear-farm")?.addEventListener("click", clearFarm)
        panel.querySelector("#clear-settings")?.addEventListener("click", clearSettings)
        panel.querySelector("#process-files-plant")?.addEventListener("click", updateFilesPlant)
        panel.querySelector("#setting-advanced")?.addEventListener("click", openModelConfigAdvanced)
        panel.querySelector("#upload-files-plant")?.addEventListener("click", () => {
            uploadPlants(getListPlants(), getListProcess())
            const input = panel.querySelector('input[name="input-file-setting-advanced"]') as HTMLInputElement

            const file = input.files ? input.files[0] : null

            if (!file) { return }

            uploadSettings(file)
        })
    }

    const uploadPlants = (plants: IFormResult, process: IFormResult) => {
        dataPlants.settings.plants.splice(0, dataPlants.settings.plants.length)
        dataPlants.process.splice(0, dataPlants.process.length)

        plants.map((_plants) => {
            // @ts-expect-error
            const plant: { code: TTableCode, file: Blob, headers: any[], name: string } = { code: "", file: new Blob([], { type: "text/plain" }), headers: [], name: "" }
            _plants.forEach((_plant) => {
                _plant.values && _plant.values.forEach((_valuesInput) => {
                    _valuesInput.forEach((_value) => {
                        plant[_value.type == "plant-type" ? "code" : _value.type == "plant-name" ? "name" : "file"] = _value.value
                    })
                })

                _plant.subMenu && _plant.subMenu.forEach((_valuesInput) => {
                    //@ts-expect-error
                    let header: THeader = { header: "", type: "" }

                    _valuesInput.forEach((_value) => {
                        header[_value.type == "header-type" ? "type" : "header"] = _value.value
                    })

                    plant.headers.push(header)
                })
            })

            dataPlants.settings.plants.push(plant)
        })

        process.forEach(_process => {
            _process.forEach(_pro => {
                _pro.values && _pro.values.forEach(_values => {
                    _values.forEach(_value => {
                        dataPlants.process.push(_value.value)
                    })
                })
            })
        })
    }

    const openModelConfigAdvanced = () => {
        const form = getContentConfigAdvanced()

        const model = modelWindow.createModel(form, "Configurações Avançadas", false)

        const btCancelConfig = form.querySelector('button[name="cancel-setting-advanced"]') as HTMLElement
        const btSaveConfig = form.querySelector('button[name="save-setting-advanced"]') as HTMLElement
        const btResetConfig = form.querySelector('button[name="reset-setting-advanced"]') as HTMLElement

        btResetConfig?.addEventListener("click", () => {
            resetConfigAdvanced()
            model.remove()
        })
        btCancelConfig?.addEventListener("click", () => model.remove())
        btSaveConfig?.addEventListener("click", () => {
            saveConfigAdvanced(form)
            model.remove()
        })

        panel.appendChild(model)
    }

    const getContentConfigAdvanced = () => {
        const FORM_CONTENT_HTML = `<div class="list-inputs-wrapper" list-content="">
        <h2># Processos</h2>

        <div class="inputs-wrapper" list-type="vertical">
            <div class="input-group">
                <input class="input" required="required" type="number" min="0" path-origin="process/deadline+D" name="input-d+1">
                <label>D+1</label>
                <i class="field-input"></i>
            </div>
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="process/criteria.selection/join" name="input-.join">
                <label>Junção de Critério de Seleção</label>
                <i class="field-input"></i>
            </div>
        </div>

        <div line="horizontal" line-width="margin"></div>
        <h2># Nome dos Cabeçalhos</h2>

        <div class="inputs-wrapper" list-type="vertical">
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="template/headerName/cep.origin.initial" name="input-headerName-cep.origin.initial">
                <label>Inicio Origem</label>
                <i class="field-input"></i>
            </div>
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="template/headerName/cep.origin.final" name="input-headerName-cep.origin.final">
                <label>Fim Origem</label>
                <i class="field-input"></i>
            </div>
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="template/headerName/cep.initial" name="input-cep.initial">
                <label>Inicio Destino</label>
                <i class="field-input"></i>
            </div>
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="template/headerName/cep.final" name="input-cep.final">
                <label>Fim Destino</label>
                <i class="field-input"></i>
            </div>
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="template/headerName/deadline+D" name="input-deadline+D">
                <label>Dias</label>
                <i class="field-input"></i>
            </div>
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="template/headerName/excess" name="input-excess">
                <label>Excedente</label>
                <i class="field-input"></i>
            </div>
        </div>

        <div line="horizontal" line-width="margin"></div>
        <h2># Valores do Template</h2>

        <div class="inputs-wrapper" list-type="vertical">
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="template/cepOriginValue/cep.origin.initial" name="input-cepOriginValue-cep.origin.final">
                <label>CEP de Inicio Origem (Preço/Prazo)</label>
                <i class="field-input"></i>
            </div>
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="template/cepOriginValue/cep.origin.final" name="input-cepOriginValue-cep.origin.initial">
                <label>CEP de Fim Origem (Preço/Prazo)</label>
                <i class="field-input"></i>
            </div>
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="template/rateValue/cep.origin.initial" name="input-rateValue-cep.origin.final">
                <label>CEP de Inicio Origem (Taxa)</label>
                <i class="field-input"></i>
            </div>
            <div class="input-group">
                <input class="input" required="required" type="text" path-origin="template/rateValue/cep.origin.final" name="input-rateValue-cep.origin.initial">
                <label>CEP de Fim Origem (Taxa)</label>
                <i class="field-input"></i>
            </div>
        </div>
    </div>
    <div button-container="end" class="actions-setting-advanced">
        <button type="button" action="_confirm" id="cancel-setting-advanced" name="reset-setting-advanced"><i class="bi-arrow-clockwise" icon=""></i><span>Resetar</span></button>
        <button type="button" action="_cancel" id="cancel-setting-advanced" name="cancel-setting-advanced"><i class="bi-x-lg" icon=""></i><span>Cancelar</span></button>
        <button type="button" action="_confirm" id="save-setting-advanced" name="save-setting-advanced"><i class="bi-check-lg" icon=""></i><span>Salvar</span></button>
    </div>`

        const form = document.createElement("form")

        form.innerHTML = FORM_CONTENT_HTML

        form.classList.add("form-setting-advanced")

        loadValuesConfigAdvanced(form)

        return form
    }

    const saveConfigAdvanced = (form: HTMLElement) => {
        const inputs = form.querySelectorAll("input") as NodeListOf<HTMLInputElement>

        inputs.forEach(_input => {
            const path = _input.getAttribute("path-origin") || ""
            const valueInput = _input.value || ""

            if (!path) { return }

            const paths = path.split("/")

            let value: any = dataPlants.settings

            for (let i = 0; i < paths.length - 1; i++) {
                if (!(paths[i] in value)) {
                    value[paths[i]] = {}
                }
                value = value[paths[i]] ? value[paths[i]] : value
            }

            Object.defineProperty(value, paths[paths.length - 1], { value: valueInput });
        })

        notificationControl.newNotification({ title: "Configurações Avançadas", body: "Configurações salvas com sucesso", type: "_success" })
    }

    const loadValuesConfigAdvanced = (form: HTMLElement) => {
        const inputs = form.querySelectorAll("input") as NodeListOf<HTMLInputElement>

        inputs.forEach(_input => {
            const path = _input.getAttribute("path-origin") || ""

            if (!path) { return }

            let value: any = dataPlants.settings

            const paths = path.split("/")

            paths.forEach(_path => {
                value = value[_path]
            })

            _input.value = value
        })
    }

    const resetConfigAdvanced = () => {
        dataPlants.settings = mainControl.getSettings({ storage: true }).settings || mainControl.getSettings().settings || _.cloneDeep(GLOBAL_SETTINGS)

        notificationControl.newNotification({ title: "Configurações Avançadas", body: "Configurações resetadas", type: "_success" })
    }

    const uploadSettings = (file: File) => {
        const fileSettings = mainControl.createFile({ content: [file], type: file.type })

        mainControl.getContentFile(fileSettings, (result) => {
            const contentSettings = converterStringToJSON<ISettingsForm>(result, ["separatorLine"])

            if (!contentSettings || !deepEqual(contentSettings, GLOBAL_TEMPLATE, ["process", "plants"])) {
                return notificationControl.newNotification({ title: "Upload de Configurações", body: "Template de configurações incorreto", type: "_error" })
            }

            Object.assign(dataPlants, contentSettings)

            notificationControl.newNotification({ title: "Upload de Configurações", body: "Configurações importadas com sucesso", type: "_success" })
        })
    }

    const updateFilesPlant = () => {
        mainControl.setupFarm(dataPlants, () => {
            mainControl.processFarm()
            prepareForDownload()
        })

        notificationControl.newNotification({ type: "_success", title: "Tratador de Fazenda", body: "Tratamento concluído" })
    }

    const prepareForDownload = () => {
        mainControl.prepareForDownload()
    }

    const downloadFiles = () => { }

    const saveFarm = () => {
        if (mainControl.getData().tables.length == 0) { return }

        const nameInput = `Fazenda`

        mainControl.saveFarm(`Teste - Fazenda${nameInput ? ` ${nameInput}` : ``}`)
    }

    const clearHistory = () => {
        mainControl.clearHistory()
    }

    const clearFarm = () => {
        mainControl.clearFarm()
    }

    const clearSettings = () => {
        mainControl.clearSettings()
    }

    // Form
    const templateSelectionPlantsParent = (actionProcessActive: string = "") => {
        const box = document.createElement("div")
        const list = ELEMENTS_FORM.selectGroupPlants.querySelector(".select-group-list.parent") as HTMLElement

        box.classList.add("box", "parent")

        const selectionContent = document.createElement("div")
        const btRemove = document.createElement("button")
        const selectionProcess = document.createElement("select")
        const subMenu = document.createElement("div")
        const input = document.createElement("input")
        const name = document.createElement("input")
        const iconRemove = createIcon("trash")

        MAP_SELECTION_PLANTS.forEach((_option) => {
            const option = document.createElement("option")

            option.innerHTML = _option.content
            option.value = _option.action

            if (actionProcessActive == _option.action) { option.selected = true }

            selectionProcess.appendChild(option)
        })

        selectionContent.classList.add("box-container", "parent")
        subMenu.classList.add("sub-menu")

        input.setAttribute("type", "file")
        name.setAttribute("type", "text")
        btRemove.setAttribute("action", "_default")
        btRemove.onclick = () => box.remove()
        SelectionGroupComponent(subMenu, { templates: { _new: templateSelectionPlantsChildren }, basePath: "", pathsValue: [], actions: ["_newOne", "_newAll", "_clear"], options: [...MAP_PARAMS["plants"]], isParent: false, updateList: false, classBox: "box", classMenu: ["select-group-list", "children"] }, ["_newAll"])

        btRemove.appendChild(iconRemove)
        selectionContent.appendChild(name)
        selectionContent.appendChild(selectionProcess)
        selectionContent.appendChild(input)
        selectionContent.appendChild(btRemove)
        box.appendChild(selectionContent)
        list.appendChild(box)
        box.appendChild(subMenu)
    }

    const templateSelectionPlantsChildren = (actionProcessActive: string = "", parentForm?: HTMLElement) => {
        if (!parentForm) { return }

        const box = document.createElement("div")
        const list = parentForm.querySelector(".select-group-list.children") as HTMLElement

        box.classList.add("box", "children")

        const selectionContent = document.createElement("div")
        const btRemove = document.createElement("button")
        const selectionProcess = document.createElement("select")
        const input = document.createElement("input")
        const iconRemove = createIcon("trash")

        MAP_PARAMS["plants"].forEach((_option) => {
            const option = document.createElement("option")

            option.innerHTML = _option.content
            option.value = _option.action

            if (actionProcessActive == _option.action) { option.selected = true }

            selectionProcess.appendChild(option)
        })

        selectionContent.classList.add("box-container", "children")

        input.setAttribute("type", "text")
        btRemove.setAttribute("action", "_default")
        btRemove.onclick = () => box.remove()

        btRemove.appendChild(iconRemove)
        selectionContent.appendChild(selectionProcess)
        selectionContent.appendChild(input)
        selectionContent.appendChild(btRemove)
        box.appendChild(selectionContent)
        list.appendChild(box)
    }

    const templateSelectionProcess = (actionProcessActive: string = "") => {
        const box = document.createElement("div")
        const list = ELEMENTS_FORM.selectGroupProcess.querySelector(".select-group-list") as HTMLElement

        box.classList.add("box", "parent")

        const selectionContent = document.createElement("div")
        const btRemove = document.createElement("button")
        const selectionProcess = document.createElement("select")
        const iconRemove = createIcon("trash")

        MAP_SELECTION_PROCESS.forEach((_option) => {
            const option = document.createElement("option")

            option.innerHTML = _option.content
            option.value = _option.action

            if (actionProcessActive == _option.action) { option.selected = true }

            selectionProcess.appendChild(option)
        })

        selectionContent.classList.add("box-container", "parent")

        btRemove.setAttribute("action", "_default")
        btRemove.onclick = () => box.remove()

        btRemove.appendChild(iconRemove)
        selectionContent.appendChild(selectionProcess)
        selectionContent.appendChild(btRemove)
        box.appendChild(selectionContent)
        list.appendChild(box)
    }

    initComponents()

    return {}
}
