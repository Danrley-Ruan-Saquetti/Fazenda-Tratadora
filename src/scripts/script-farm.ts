function FarmScript(idPanel: string) {
    const panel = document.querySelector(`[panel="farm"][id="${idPanel}"]`) as HTMLElement

    if (!panel) { return { error: { msg: "Panel not found" } } }

    const mainControl = MainControl()
    const renderControl = RenderControl()

    const ELEMENTS_FORM = {
        plantDeadline: panel.querySelector("#input-file-plant-deadline") as HTMLInputElement,
        plantPrice: panel.querySelector("#input-file-plant-price") as HTMLInputElement,
        fileSettings: panel.querySelector("#input-file-settings") as HTMLInputElement,
        paramCepInitial: panel.querySelector("#param-cep-initial") as HTMLInputElement,
        paramCepFinal: panel.querySelector("#param-cep-final") as HTMLInputElement,
        paramCepOriginInitial: panel.querySelector("#param-cep-origin-initial") as HTMLInputElement,
        paramCepOriginFinal: panel.querySelector("#param-cep-origin-final") as HTMLInputElement,
        paramDeadline: panel.querySelector("#param-deadline") as HTMLInputElement,
        paramRateDeadline: panel.querySelector("#param-rate-deadline") as HTMLInputElement,
        paramRatePrice: panel.querySelector("#param-rate-price") as HTMLInputElement,
        paramSelectionCriteriaDeadline: panel.querySelector("#param-selection-criteria-deadline") as HTMLInputElement,
        paramSelectionCriteriaPrice: panel.querySelector("#param-selection-criteria-price") as HTMLInputElement,
        paramExcess: panel.querySelector("#param-excess") as HTMLInputElement,
        nameFarm: panel.querySelector("#param-name-farm") as HTMLInputElement,
    }

    const PARAMS: ISettingsGeneral = {
        "table": {
            "cep.initial": "CEP INICIAL",
            "cep.final": "CEP FINAL",
            "deadline": "Prazo",
            "excess": "Exce",
            "rate": {
                "deadline": "",
                "price": ""
            },
            "selection.criteria": {
                "price": "UF,REGIAO",
                "deadline": "UF,REGIAO"
            }
        },
        process: _.cloneDeep(GLOBAL_SETTINGS.process),
        template: _.cloneDeep(GLOBAL_SETTINGS.template),
    }

    const initComponents = () => {
        Setup()

        renderControl.loadListFarms()
        loadForm()

        panel.querySelector("#upload-files-plant")?.addEventListener("click", updateFilesPlant)
        panel.querySelector("#download-files")?.addEventListener("click", downloadFiles)
        panel.querySelector("#save-farm")?.addEventListener("click", saveFarm)
        panel.querySelector("#get-data")?.addEventListener("click", () => mainControl.getData(idPanel))
        panel.querySelector("#clear-ls")?.addEventListener("click", clearHistory)
        panel.querySelector("#clear-farm")?.addEventListener("click", clearFarm)
        panel.querySelector("#clear-settings")?.addEventListener("click", clearSettings)
        ELEMENTS_FORM.fileSettings.addEventListener("change", uploadSettings)
    }

    const loadForm = () => {
        ELEMENTS_FORM.paramCepInitial.value = PARAMS.table["cep.initial"]
        ELEMENTS_FORM.paramCepFinal.value = PARAMS.table["cep.final"]
        ELEMENTS_FORM.paramCepOriginInitial.value = PARAMS.template.cepOriginValue["cep.origin.initial"]
        ELEMENTS_FORM.paramCepOriginFinal.value = PARAMS.template.cepOriginValue["cep.origin.final"]
        ELEMENTS_FORM.paramDeadline.value = PARAMS.table.deadline
        ELEMENTS_FORM.paramRateDeadline.value = PARAMS.table.rate.deadline
        ELEMENTS_FORM.paramRatePrice.value = PARAMS.table.rate.price
        ELEMENTS_FORM.paramSelectionCriteriaDeadline.value = PARAMS.table["selection.criteria"].deadline
        ELEMENTS_FORM.paramSelectionCriteriaPrice.value = PARAMS.table["selection.criteria"].price
        ELEMENTS_FORM.paramExcess.value = PARAMS.table.excess
    }

    const uploadSettings = () => {
        const fileSettingsInput = ELEMENTS_FORM.fileSettings?.files ? ELEMENTS_FORM.fileSettings?.files[0] : null

        if (!fileSettingsInput) { return }

        const fileSettings = mainControl.createFile({ content: [fileSettingsInput], type: fileSettingsInput.type })

        mainControl.getContentFile(fileSettings, (result) => {
            const contentSettings = converterStringToJSON<ISettingsGeneral>(result, ["separatorLine"])

            if (!contentSettings || !deepEqual(contentSettings, GLOBAL_SETTINGS)) {
                return console.log("Template incorrect")
            }

            Object.assign(PARAMS, contentSettings)

            loadForm()
        })
    }

    const getDataOfForm = () => {
        const plantDeadline = ELEMENTS_FORM.plantDeadline?.files ? ELEMENTS_FORM.plantDeadline?.files[0] : null
        const plantPrice = ELEMENTS_FORM.plantPrice?.files ? ELEMENTS_FORM.plantPrice?.files[0] : null
        const paramCepInitial = `${ELEMENTS_FORM.paramCepInitial?.value}`
        const paramCepFinal = `${ELEMENTS_FORM.paramCepFinal?.value}`
        const paramCepOriginInitial = `${ELEMENTS_FORM.paramCepOriginInitial?.value}`
        const paramCepOriginFinal = `${ELEMENTS_FORM.paramCepOriginFinal?.value}`
        const paramDeadline = `${ELEMENTS_FORM.paramDeadline?.value}`
        const paramRateDeadline = `${ELEMENTS_FORM.paramRateDeadline?.value}`
        const paramRatePrice = `${ELEMENTS_FORM.paramRatePrice?.value}`
        const paramSelectionCriteriaDeadline = `${ELEMENTS_FORM.paramSelectionCriteriaDeadline?.value}`
        const paramSelectionCriteriaPrice = `${ELEMENTS_FORM.paramSelectionCriteriaPrice?.value}`
        const paramExcess = `${ELEMENTS_FORM.paramExcess?.value}`

        const dataPlants: { plants: { code: TTableCode, file: Blob, headers: THeader[], name: string }[], settings: ISettingsGeneral } = {
            plants:
                [
                    {
                        code: "plant.deadline", file: plantDeadline || mainControl.createFile({ content: [plantDeadlineTest] }),
                        headers: [
                            { header: PARAMS.template.headerName["cep.origin.initial"], type: "cep.origin.initial", value: paramCepOriginInitial || PARAMS.template.cepOriginValue["cep.origin.initial"] },
                            { header: PARAMS.template.headerName["cep.origin.final"], type: "cep.origin.final", value: paramCepOriginFinal || PARAMS.template.cepOriginValue["cep.origin.final"] },
                            { header: paramCepFinal || PARAMS.table["cep.final"], type: "cep.final" },
                            { header: paramCepInitial || PARAMS.table["cep.initial"], type: "cep.initial" },
                            { header: paramDeadline || PARAMS.table.deadline, type: "deadline" },
                            { header: paramSelectionCriteriaDeadline || PARAMS.table["selection.criteria"].deadline, type: "selection-criteria" },
                            { header: paramRateDeadline || PARAMS.table.rate.deadline, type: "rate" },
                        ],
                        name: "Planta Prazo"
                    },
                    {
                        code: "plant.price", file: plantPrice || mainControl.createFile({ content: [plantPriceTest] }),
                        headers: [
                            { header: paramExcess || PARAMS.table.excess, type: "excess" },
                            { header: paramSelectionCriteriaPrice || PARAMS.table["selection.criteria"].price, type: "selection-criteria" },
                            { header: paramRatePrice || PARAMS.table.rate.price, type: "rate" },
                        ],
                        name: "Planta Preço"
                    },
                ],
            settings: PARAMS
        }

        if (!plantDeadline || !plantPrice || !paramCepInitial || !paramCepFinal || !paramCepOriginInitial || !paramCepOriginFinal || !paramDeadline || !paramSelectionCriteriaDeadline || !paramSelectionCriteriaPrice || !paramExcess) { console.log("$Teste"); return dataPlants }

        return dataPlants
    }

    const updateFilesPlant = () => {
        const bodyForm = getDataOfForm()

        if (!bodyForm) { return }

        mainControl.setupFarm({
            plants: bodyForm.plants,
            settings: bodyForm.settings,
        }, () => {
            mainControl.processFarm()
            prepareForDownload()
        })
    }

    const prepareForDownload = () => {
        mainControl.prepareForDownload()
    }

    const downloadFiles = () => { }

    const saveFarm = () => {
        if (mainControl.getData().tables.length == 0) { return }

        const nameInput = `${ELEMENTS_FORM.nameFarm.value}`

        mainControl.saveFarm(`Teste - Fazenda${nameInput ? ` ${nameInput}` : ``}`)
        renderControl.loadListFarms()
    }

    const clearHistory = () => {
        mainControl.clearHistory()
        renderControl.loadListFarms()
    }

    const clearFarm = () => {
        mainControl.clearFarm()
    }

    const clearSettings = () => {
        mainControl.clearSettings()
    }

    initComponents()

    return {}
}