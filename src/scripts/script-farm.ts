function FarmScript(idPanel: string) {
    const panel = document.querySelector(`[panel="farm"][id="${idPanel}"]`) as HTMLElement

    if (!panel) { return { error: { msg: "Panel not found" } } }

    const notificationControl = NotificationControl(document.querySelector(".list-notification") as HTMLElement)

    const mainControl = MainControl()
    const renderControl = RenderControl()

    const ELEMENTS_FORM = {
        plantDeadline: panel.querySelector("#input-file-plant-deadline") as HTMLInputElement,
        plantPrice: panel.querySelector("#input-file-plant-price") as HTMLInputElement,
        plantFarm: panel.querySelector("#input-file-farm") as HTMLInputElement,
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

    const PARAMS: ISettingsTemplate = GLOBAL_DEPENDENCE == "production" ? _.cloneDeep(GLOBAL_TEMPLATE) : {
        "settings": {
            "process": {
                "deadline+D": 1,
                "criteria.selection": {
                    "join": " "
                },
                "converterStringTable": {
                    "separatorLine": /\r?\n/,
                    "separatorColumn": ";",
                    "configSeparatorColumn": {
                        "separator": ",",
                        "searchValue": ",",
                        "replaceValue": "?",
                        "betweenText": "\""
                    }
                }
            },
            "template": {
                "rateValue": {
                    "cep.origin.initial": "1000000",
                    "cep.origin.final": "99999999"
                },
                "headerName": {
                    "cep.origin.initial": "Inicio  Origem",
                    "cep.origin.final": "Fim  Origem",
                    "cep.initial": "Inicio  Destino",
                    "cep.final": "Fim  Destino",
                    "deadline+D": "Dias",
                    "excess": "Excedente"
                },
                "cepOriginValue": {
                    "cep.origin.final": "",
                    "cep.origin.initial": ""
                }
            },
            "plants": []
        },
        "process": [
            "create-farm",
            "insert-values",
            "deadline+D",
            "contained-cep",
            "procv",
            "template",
            "rate"
        ]
    }

    const initComponents = () => {
        PreloadPanel(panel)
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
        ELEMENTS_FORM.paramCepOriginInitial.value = PARAMS.settings.template.cepOriginValue["cep.origin.initial"]
        ELEMENTS_FORM.paramCepOriginFinal.value = PARAMS.settings.template.cepOriginValue["cep.origin.final"]
    }

    const uploadSettings = () => {
        const fileSettingsInput = ELEMENTS_FORM.fileSettings?.files ? ELEMENTS_FORM.fileSettings?.files[0] : null

        if (!fileSettingsInput) { return }

        const fileSettings = mainControl.createFile({ content: [fileSettingsInput], type: fileSettingsInput.type })

        mainControl.getContentFile(fileSettings, (result) => {
            const contentSettings = converterStringToJSON<ISettingsTemplate>(result, ["separatorLine"])

            if (!contentSettings || !deepEqual(contentSettings, GLOBAL_TEMPLATE)) {
                console.log("Template incorrect")
            }

            Object.assign(PARAMS, contentSettings)

            loadForm()
        })
    }

    const getDataOfForm = () => {
        const plantFarm = ELEMENTS_FORM.plantFarm?.files ? ELEMENTS_FORM.plantFarm?.files[0] : null
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

        const dataPlants: ISettingsTemplate = {
            ...PARAMS
        }

        if ((GLOBAL_DEPENDENCE == "production" && plantFarm) || GLOBAL_DEPENDENCE == "development") dataPlants.plants.push({
            code: "farm", file: plantFarm || mainControl.createFile({ content: [plantFarmTest] }),
            headers: [
                { header: paramCepFinal, type: "cep.final" },
                { header: paramCepInitial, type: "cep.initial" },
                { header: paramDeadline, type: "deadline" },
                { header: paramRateDeadline, type: "rate" },
                { header: paramExcess, type: "excess" },
                { header: paramSelectionCriteriaDeadline, type: "selection-criteria" },
            ],
            name: "Fazenda"
        })
        if ((GLOBAL_DEPENDENCE == "production" && plantDeadline) || GLOBAL_DEPENDENCE == "development") dataPlants.plants.push({
            code: "plant.deadline", file: plantDeadline || mainControl.createFile({ content: [plantDeadlineTest] }),
            headers: [
                { header: paramCepFinal, type: "cep.final" },
                { header: paramCepInitial, type: "cep.initial" },
                { header: paramDeadline, type: "deadline" },
                { header: paramSelectionCriteriaDeadline, type: "selection-criteria" },
                { header: paramRateDeadline, type: "rate" },
            ],
            name: "Planta Prazo"
        })
        if ((GLOBAL_DEPENDENCE == "production" && plantPrice) || GLOBAL_DEPENDENCE == "development") dataPlants.plants.push({
            code: "plant.price", file: plantPrice || mainControl.createFile({ content: [plantPriceTest] }),
            headers: [
                { header: paramExcess, type: "excess" },
                { header: paramSelectionCriteriaPrice, type: "selection-criteria" },
                { header: paramRatePrice, type: "rate" },
            ],
            name: "Planta Preço"
        })

        return dataPlants
    }

    const updateFilesPlant = () => {
        const bodyForm = getDataOfForm()

        if (!bodyForm) { return }

        mainControl.setupFarm({
            plants: bodyForm.plants,
            settings: bodyForm.settings,
            process: bodyForm.process,
        }, () => {
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

        const nameInput = `${ELEMENTS_FORM.nameFarm.value}`

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

    initComponents()

    return {}
}