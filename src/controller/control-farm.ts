function FarmControl(farmRepository: IFarmRepository) {
    const fileControl = FileControl(farmRepository)
    const tableControl = TableControl()
    const settingControl = SettingControl(farmRepository)

    const getHeadersWeight = ({ table }: { table: TTable }) => {
        const headersWeight: THeader[] = []

        for (let j = 0; j < table[0].length; j++) {
            const column = table[0][j]

            const _column = replaceText({ val: column, searchValue: '"', replaceValue: '' })

            if (isNumber(_column)) {
                headersWeight.push({ header: column, type: "weight" })
            }
        }

        return headersWeight
    }

    const uploadFilesPlants = ({ plants }: { plants: { code: TTableCode, file: Blob, headers: THeader[], name: string }[] }, callback?: Function) => {
        let contFiles = 0

        const updateContFiles = () => {
            contFiles++

            if (contFiles == plants.length) callback && callback()
        }

        plants.forEach(plant => uploadFilePlant(plant, updateContFiles))
    }

    const uploadFilePlant = ({ code, file, headers, name }: { file: Blob, code: TTableCode, headers: THeader[], name: string }, callback: Function) => {
        const settings = settingControl.getSettings({ farm: true }).settings.process.converterStringTable

        fileControl.getContentFile(file, result => {
            const table = tableControl.converterStringForTable({ value: result, separatorLine: settings.separatorLine, separatorColumn: settings.separatorColumn, configSeparatorColumn: settings.configSeparatorColumn })

            const tableModel = createPlant({ code, headers, table, name })

            addTable({ tableModel })
            callback()
        })
    }

    const createPlant = ({ headers, table, code, name }: ITableModel) => {
        const headersM: THeader[] = []

        for (let i = 0; i < headers.length; i++) {
            const _header = headers[i]

            if (!_header.header) { continue }

            if (_header.type != "selection-criteria" && _header.type != "rate") {
                headersM.push(_header)
                continue
            }

            _header.header.split(",").forEach(a => headersM.push({ header: a, type: _header.type }))
        }

        const modelTable: ITableModel = { table, headers: headersM, code, name }

        return modelTable
    }

    const createFarm = ({ plant, headers, name }: { plant: TTable, headers: THeader[], name: string }) => {
        const logs: TLog[] = []

        const table: TTable = new Array(plant.length).fill("").map(() => [])

        for (let i = 0; i < headers.length; i++) {
            tableControl.addColumn({ table, header: headers[i].header })
        }

        const modelTable: ITableModel = { table, headers, code: "farm", name }

        logs.push({ date: new Date(Date.now()), type: "success", message: `Create table farm successfully` })

        return { modelTable, logs }
    }

    const createTemplate = ({ tableBase, headers, code, name, settings }: { tableBase: TTable, code: TTableCode, headers: THeader[], name: string, settings: ISettingsFarm }) => {
        const logs: TLog[] = []

        const table: TTable = new Array(tableBase.length).fill("").map(() => [])

        for (let k = 0; k < headers.length; k++) {
            const headerName = settings.template.headerName[headers[k].type] || headers[k].header

            tableControl.addColumn({ table, header: headerName, value: headers[k].value })

            if (headers[k].value) { continue }

            const indexHeaderBase = tableControl.getIndex({ valueSearch: headers[k].header, where: { array: tableBase[0] } })

            if (indexHeaderBase < 0) { continue }

            for (let i = 1; i < tableBase.length; i++) {
                table[i][table[0].length - 1] = tableBase[i][indexHeaderBase]
            }
        }

        const modelTable: ITableModel = { table, headers, code, name }

        logs.push({ date: new Date(Date.now()), type: "success", message: `Create template "${code == "template.deadline" ? "deadline" : code == "template.price" ? "price" : ""}" successfully` })

        return { modelTable, logs }
    }

    const createTemplateRate = ({ tableBase, headers, value, code, name, settings }: { tableBase: TTable, code: TTableCode, headers: THeader[], name: string, value: string, settings: ISettingsFarm }) => {
        const logs: TLog[] = []
        const headerRate = getHeaders({ tableModel: { table: tableBase, headers: headers }, types: ["rate"] })[0]

        if (!headerRate) {
            logs.push({ type: "warning", message: `Column rate not found in "${name}"` })
            return { modelTable: null, logs }
        }

        headers.splice(tableControl.getIndex({ valueSearch: headerRate.header, where: { array: headers.map(_header => { return _header.header }) } }), 1)

        const table: TTable = []

        table.push([])

        const indexHeaders: { jT: number, jB: number, value?: string }[] = []

        for (let c = 0; c < headers.length; c++) {
            const _header = headers[c]

            table[0].push(settings.template.headerName[_header.type] || _header.header)

            const indexHeader = tableControl.getIndex({ valueSearch: _header.header, where: { array: tableBase[0] } })

            if (indexHeader < 0) {
                if (headers[c].value) {
                    indexHeaders.push({ jB: -1, jT: table[0].length - 1, value: headers[c].value })
                }
                continue
            }

            indexHeaders.push({ jB: indexHeader, jT: table[0].length - 1 })
        }

        const indexHeaderRate = tableControl.getIndex({ valueSearch: headerRate.header, where: { array: tableBase[0] } })

        if (indexHeaderRate < 0) { return { modelTable: null, logs } }

        for (let i = 1; i < tableBase.length; i++) {
            const cellRate = tableBase[i][indexHeaderRate]

            if (cellRate != value) { continue }

            table.push([])

            for (let j = 0; j < tableBase[i].length; j++) {
                for (let k = 0; k < indexHeaders.length; k++) {
                    const indexHeader = indexHeaders[k]

                    table[table.length - 1][indexHeader.jT] = indexHeader.value || tableBase[i][indexHeader.jB]
                }
            }
        }

        const modelTable: ITableModel = { table, headers, code, name }

        logs.push({ date: new Date(Date.now()), type: "success", message: `Create template rate "${name}" successfully` })

        return { modelTable: modelTable, logs }
    }

    const processFarm = ({ modelTables, settings }: { modelTables: ITableModel[], settings: ISettingsGeneral }) => {
        const repoControl = FarmControl(FarmRepository())

        repoControl.setup({ id: null, settings, tables: modelTables, logs: [] })

        const modelTablePlantPrice = repoControl.getTable({ code: "plant.price" })[0]
        const modelTablePlantDeadline = repoControl.getTable({ code: "plant.deadline" })[0]

        if (!modelTablePlantPrice || !modelTablePlantDeadline) {
            !modelTablePlantDeadline && repoControl.addLog({ date: new Date(Date.now()), type: "error", message: "Table deadline not defined" })
            !modelTablePlantPrice && repoControl.addLog({ date: new Date(Date.now()), type: "error", message: "Table price not defined" })

            repoControl.addLog({ date: new Date(Date.now()), type: "info", message: `Process farm finished by force` })

            return repoControl.getData()
        }

        const headersPlantDeadline: THeader[] = [
            ...getHeaders({ tableModel: modelTablePlantDeadline, types: ["cep.origin.initial", "cep.origin.final", "cep.initial", "cep.final", "deadline", "excess", "rate", "selection-criteria"] }),
        ]

        const headersPlantPrice: THeader[] = [
            ...getHeaders({ tableModel: modelTablePlantPrice }),
            ...getHeadersWeight({ table: [modelTablePlantPrice.table[0]] }),
        ]

        repoControl.updateHeaders({ code: "plant.price", headers: headersPlantPrice })

        const headerDeadline = getHeaders({ tableModel: modelTablePlantDeadline, types: ["deadline"] })[0]

        const headerPlantValueDeadlineToFarm: THeader[] = [
            ...getHeaders({ tableModel: modelTablePlantDeadline, types: ["cep.origin.initial", "cep.origin.final", "cep.initial", "cep.final"] }),
            { header: headerDeadline ? headerDeadline.header + "+" + settings.process["deadline+D"] : "D+" + settings.process["deadline+D"], type: "deadline+D" },
            ...getHeaders({ tableModel: modelTablePlantDeadline, types: ["selection-criteria", "excess", "rate"] }),
        ]
        const headerPlantValuePriceToFarm: THeader[] = [
            ...getHeaders({ tableModel: modelTablePlantPrice, types: ["excess", "rate", "selection-criteria"] }),
            ...getHeadersWeight({ table: [modelTablePlantPrice.table[0]] })
        ]
        const headersFarm: THeader[] = [
            ...getHeaders({ tableModel: modelTablePlantDeadline, types: ["cep.initial", "cep.final"] }),
            { header: headerDeadline ? headerDeadline.header + "+" + settings.process["deadline+D"] : "D+" + settings.process["deadline+D"], type: "deadline+D" },
            ...getHeaders({ tableModel: modelTablePlantDeadline, types: ["selection-criteria", "excess", "rate"] }),
            ...getHeaders({ tableModel: modelTablePlantPrice, types: ["excess", "rate"] }),
            ...getHeadersWeight({ table: [modelTablePlantPrice.table[0]] })
        ]

        const { modelTable: modelTableFarm, logs: logsCreateFarm } = createFarm({ headers: headersFarm, plant: modelTablePlantDeadline.table, name: "Fazenda" })

        repoControl.addLogs(logsCreateFarm)

        repoControl.addTable({ tableModel: modelTableFarm })

        const { logs: logsInsertValues } = insertValues({ table: modelTableFarm.table, tablePlant: modelTablePlantDeadline.table, headers: headerPlantValueDeadlineToFarm })

        repoControl.addLogs(logsInsertValues)

        const indexCepInitial = tableControl.getIndex({ valueSearch: getHeaders({ tableModel: { table: modelTableFarm.table, headers: headersFarm }, types: ["cep.initial"] })[0]?.header, where: { array: modelTableFarm.table[0] } })
        const indexCepFinal = tableControl.getIndex({ valueSearch: getHeaders({ tableModel: { table: modelTableFarm.table, headers: headersFarm }, types: ["cep.final"] })[0]?.header, where: { array: modelTableFarm.table[0] } })

        if (indexCepInitial < 0 || indexCepFinal < 0) {
            !indexCepInitial && repoControl.addLog({ date: new Date(Date.now()), type: "error", message: `"${getHeaders({ tableModel: { table: modelTableFarm.table, headers: headersFarm }, types: ["cep.initial"] })[0]?.header || "Cep initial"}" not found` })
            !indexCepFinal && repoControl.addLog({ date: new Date(Date.now()), type: "error", message: `"${getHeaders({ tableModel: { table: modelTableFarm.table, headers: headersFarm }, types: ["cep.final"] })[0]?.header || "Cep final"}" not found` })

            return repoControl.getData()
        }

        tableControl.removeCharacter({ table: modelTableFarm.table, character: "-", options: { specific: { column: indexCepInitial }, excludes: { line: [0] } } })
        tableControl.removeCharacter({ table: modelTableFarm.table, character: "-", options: { specific: { column: indexCepFinal }, excludes: { line: [0] } } })

        const { logs: logsInsertValuesDMoreOne } = insertValuesDMoreOne({ tableModel: { table: modelTableFarm.table, headers: headersFarm }, tableBase: { table: modelTablePlantDeadline.table, headers: headersPlantDeadline }, settings })

        repoControl.addLogs(logsInsertValuesDMoreOne)

        modelTableFarm.table = tableControl.orderTable({ table: modelTableFarm.table, column: indexCepInitial })

        repoControl.addLog({ date: new Date(Date.now()), type: "success", message: `Table farm ordered successfully` })

        const { logs: logsValidateContainedCEP } = validateContainedCEP({ table: { table: modelTableFarm.table, code: "farm", headers: headersFarm } })

        repoControl.addLogs(logsValidateContainedCEP)

        const headersTemplateDeadline: THeader[] = [
            ...getHeaders({ tableModel: { table: modelTablePlantDeadline.table, code: "plant.deadline", headers: headersPlantDeadline }, types: ["cep.origin.initial", "cep.origin.final"] }),
            ...getHeaders({ tableModel: { table: modelTableFarm.table, code: "farm", headers: headersFarm }, types: ["cep.initial", "cep.final", "deadline+D"] }),
        ]
        const headersTemplatePrice: THeader[] = [
            ...getHeaders({ tableModel: { table: modelTablePlantDeadline.table, code: "plant.deadline", headers: headersPlantDeadline }, types: ["cep.origin.initial", "cep.origin.final"] }),
            ...getHeaders({ tableModel: { table: modelTableFarm.table, code: "farm", headers: headersFarm }, types: ["cep.initial", "cep.final", "excess"] }),
            ...getHeadersWeight({ table: [modelTableFarm.table[0]] }),
        ]

        const headersTemplateRate: THeader[] = [
            { header: settings.template.headerName["cep.origin.initial"], type: "cep.origin.initial", value: settings.template.rateValue["cep.origin.initial"] },
            { header: settings.template.headerName["cep.origin.final"], type: "cep.origin.final", value: settings.template.rateValue["cep.origin.final"] },
            ...getHeaders({ tableModel: modelTablePlantDeadline, types: ["cep.initial", "cep.final"] })
        ]

        const { logs: logsInsertProcvValues } = insertProcvValues({ tableModel: { table: modelTableFarm.table, code: "farm", headers: headersFarm }, tableBase: { table: modelTablePlantPrice.table, code: "plant.price", headers: headerPlantValuePriceToFarm }, headers: headerPlantValuePriceToFarm, settings })

        repoControl.addLogs(logsInsertProcvValues)

        const { modelTable: modelTableTemplateDeadline, logs: logsTableTableTemplateDeadline } = createTemplate({ code: "template.deadline", headers: headersTemplateDeadline, tableBase: modelTableFarm.table, name: "Template Prazo", settings })
        const { modelTable: modelTableTemplatePrice, logs: logsTableTableTemplatePrice } = createTemplate({ code: "template.price", headers: headersTemplatePrice, tableBase: modelTableFarm.table, name: "Template Preço", settings })

        repoControl.addLogs(logsTableTableTemplateDeadline)
        repoControl.addLogs(logsTableTableTemplatePrice)

        const headersRate = [
            ...getHeaders({ tableModel: modelTablePlantDeadline, types: ["rate"] }),
            ...getHeaders({ tableModel: modelTablePlantPrice, types: ["rate"] }),
        ]

        for (let c = 0; c < headersRate.length; c++) {
            const _headerRate = headersRate[c]

            const indexHeader = tableControl.getIndex({ valueSearch: _headerRate.header, where: { array: modelTableFarm.table[0] } })

            if (indexHeader < 0) { continue }

            const rateValues = tableControl.getDistinctColumnValues({ table: modelTableFarm.table, columnIndex: indexHeader, excludes: { line: 0 } })

            for (let c = 0; c < rateValues.length; c++) {
                const _rateValue = rateValues[c]

                if (!_rateValue || (isNumber(_rateValue) && Number(_rateValue) <= 0)) { continue }

                const name = `Template Taxa - ${replaceText({ val: replaceText({ val: _headerRate.header + " " + _rateValue, searchValue: `"`, replaceValue: "" }), searchValue: `/`, replaceValue: "" })}`

                const { modelTable: modelTableTemplateRate, logs: logsCreateTemplateRate } = createTemplateRate({ tableBase: modelTableFarm.table, code: "template.rate", name, headers: [...headersTemplateRate, _headerRate], value: _rateValue, settings })

                repoControl.addLogs(logsCreateTemplateRate)

                if (!modelTableTemplateRate) { continue }

                repoControl.addTable({ tableModel: modelTableTemplateRate, saveOld: true })
            }
        }

        repoControl.addTable({ tableModel: { table: modelTableFarm.table, code: "farm", headers: headersFarm, name: "Fazenda" } })
        repoControl.addTable({ tableModel: modelTableTemplateDeadline })
        repoControl.addTable({ tableModel: modelTableTemplatePrice })

        repoControl.addLog({ date: new Date(Date.now()), type: "info", message: `Process farm finished` })

        return repoControl.getData()
    }

    const insertValues = ({ tablePlant, table, headers }: { table: TTable, tablePlant: TTable, headers: THeader[] }) => {
        const logs: TLog[] = []

        for (let k = 0; k < headers.length; k++) {
            const indexColumnHeader = tableControl.getIndex({ valueSearch: headers[k].header, where: { array: table[0] } })
            const indexColumnHeaderPlant = tableControl.getIndex({ valueSearch: headers[k].header, where: { array: tablePlant[0] } })

            if (indexColumnHeader < 0 || indexColumnHeaderPlant < 0) {
                if (indexColumnHeaderPlant < 0 && (headers[k].type == "cep.final" || headers[k].type == "cep.initial")) logs.push({ type: "alert", message: `Column "${headers[k].header}" not found in plant` })
                continue
            }

            for (let i = 1; i < table.length; i++) {
                table[i][indexColumnHeader] = tablePlant[i][indexColumnHeaderPlant]
            }
        }

        logs.push({ date: new Date(Date.now()), type: logs.length == 0 ? "success" : "alert", message: `Table values inserted successfully${logs.length != 0 ? ". But no values for Cep" : ""}` })

        return { logs }
    }

    const insertCSValue = ({ }: { table: TTable, headers: THeader[] }) => {

    }

    const insertValuesDMoreOne = ({ tableModel, tableBase, settings }: { tableModel: { table: TTable, headers: THeader[] }, tableBase: { table: TTable, headers: THeader[] }, settings: ISettingsFarm }) => {
        const logs: TLog[] = []

        const headerDeadlineMoreD = tableControl.getIndex({ valueSearch: getHeaders({ tableModel: { table: tableModel.table, headers: tableModel.headers }, types: ["deadline+D"] })[0]?.header || "", where: { array: tableModel.table[0] } })
        const headerDeadline = tableControl.getIndex({ valueSearch: getHeaders({ tableModel: { table: tableBase.table, headers: tableBase.headers }, types: ["deadline"] })[0]?.header || "", where: { array: tableBase.table[0] } })

        if (headerDeadline < 0 || headerDeadlineMoreD < 0) {
            !headerDeadline && logs.push({ type: "warning", message: `Column "${getHeaders({ tableModel: { table: tableModel.table, headers: tableModel.headers }, types: ["deadline+D"] })[0]?.header || "Deadline"}" not found in plant deadline` })

            return { logs }
        }

        const valueD = Number(settings.process["deadline+D"])

        for (let i = 1; i < tableModel.table.length; i++) {
            tableModel.table[i][headerDeadlineMoreD] = `${Number(tableBase.table[i][headerDeadline]) + valueD}`
        }

        return { logs }
    }

    const validateContainedCEP = ({ table }: { table: { table: TTable, code: TTableCode, headers: THeader[] } }) => {
        const logs: TLog[] = []

        const indexHeaderCepInitial = tableControl.getIndex({ valueSearch: getHeaders({ tableModel: table, types: ["cep.initial"] })[0].header, where: { array: table.table[0] } })
        const indexHeaderCepFinal = tableControl.getIndex({ valueSearch: getHeaders({ tableModel: table, types: ["cep.final"] })[0].header, where: { array: table.table[0] } })

        if (indexHeaderCepInitial < 0 || indexHeaderCepFinal < 0) {
            indexHeaderCepInitial < 0 && logs.push({ type: "error", message: `"${getHeaders({ tableModel: table, types: ["cep.initial"] })[0]?.header || "Cep initial"}" not found` })
            indexHeaderCepFinal < 0 && logs.push({ type: "error", message: `"${getHeaders({ tableModel: table, types: ["cep.final"] })[0]?.header || "Cep final"}" not found` })

            return { logs }
        }

        for (let i = 1; i < table.table.length; i++) {
            const matCepInitial = Number(table.table[i][indexHeaderCepInitial])
            const matCepFinal = Number(table.table[i][indexHeaderCepFinal])

            const calcSameRange = matCepFinal - matCepInitial

            if (calcSameRange < 0) {
                logs.push({ type: "warning", message: `${i}: ${matCepFinal} < ${matCepInitial} != ${calcSameRange}` })
            }

            if (i > 1) {
                const calcFinalInitial = matCepInitial - Number(table.table[i - 1][indexHeaderCepFinal])

                if (calcFinalInitial < 0) {
                    logs.push({ type: "warning", message: `${i}: ${matCepInitial} < ${i - 1}: ${table.table[i - 1][indexHeaderCepFinal]} != ${calcFinalInitial}` })
                }
            }
        }

        logs.push({ date: new Date(Date.now()), type: logs.length == 0 ? "success" : "alert", message: logs.length == 0 ? `There is no Cep contained` : `There is Cep contained` })

        return { logs }
    }

    const insertProcvValues = ({ headers, tableModel, tableBase, settings }: { tableModel: { table: TTable, code: TTableCode, headers: THeader[] }, tableBase: { table: TTable, code: TTableCode, headers: THeader[] }, headers: THeader[], settings: ISettingsFarm }) => {
        const logs: TLog[] = []
        const headersSelectionCriteria = getHeaders({ tableModel, types: ["selection-criteria"] })

        for (let i = 1; i < tableModel.table.length; i++) {
            for (let k = 0; k < headers.length; k++) {
                const indexHeader = tableControl.getIndex({ valueSearch: headers[k].header, where: { array: tableModel.table[0] } })

                if (indexHeader < 0) { continue }

                const csF = getSelectionCriteria({ table: tableModel.table, i, headers: headersSelectionCriteria, settings })

                const procvValue = procv({ valueScSearch: csF, header: headers[k].header, tableBase, settings })

                if (!procvValue) {
                    logs.push({ type: "alert", message: `Criteria selection '${csF}' not found in table "${tableBase.code == "plant.deadline" || tableBase.code == "template.deadline" ? "deadline" : tableBase.code == "template.price" || tableBase.code == "plant.price" ? "price" : tableBase.code == "template.rate" ? "rate" : tableBase.code}"` })
                }

                tableModel.table[i][indexHeader] = procvValue
            }
        }

        logs.push({ date: new Date(Date.now()), type: logs.length == 0 ? "success" : "alert", message: `Table values inserted whit procv successfully${logs.length != 0 ? ". But there are discrepancies" : ""}` })

        return { logs }
    }

    function getSelectionCriteria({ table, i, headers, settings }: { table: TTable, headers: THeader[], i: number, settings: ISettingsFarm }) {
        const sc: string[] = []

        headers.forEach(_header => {
            const indexColumn = table[0].indexOf(_header.header)

            indexColumn >= 0 && sc.push(table[i][indexColumn])
        })

        return sc.join(settings.process["criteria.selection"].join)
    }

    const procv = ({ tableBase, valueScSearch, header, settings }: { tableBase: { table: TTable, headers: THeader[] }, valueScSearch: string, header: string, settings: ISettingsFarm }) => {
        const indexHeaderPlant = tableControl.getIndex({ valueSearch: header, where: { array: tableBase.table[0] } })
        const headersSelectionCriteria = getHeaders({ tableModel: tableBase, types: ["selection-criteria"] })

        if (indexHeaderPlant < 0 || headersSelectionCriteria.length == 0) { return "" }

        for (let i = 1; i < tableBase.table.length; i++) {
            const csB = getSelectionCriteria({ i, headers: headersSelectionCriteria, table: tableBase.table, settings })

            if (!csB) { continue }

            if (`${csB}` != `${valueScSearch}`) { continue }

            return tableBase.table[i][indexHeaderPlant]
        }

        return ""
    }

    // Repo
    const getData: () => IFarm = () => {
        return _.cloneDeep(farmRepository.data)
    }

    const setup = (props: IFarm) => {
        farmRepository.setup(props)
    }

    const reset = () => {
        farmRepository.reset()
    }

    const addTable = (props: { tableModel: ITableModel, saveOld?: boolean }) => {
        farmRepository.addTable(props.tableModel, props.saveOld)
    }

    const getTable: (props: { code: TTableCode }) => { table: TTable, code: TTableCode, headers: THeader[], name: string, index: number, }[] = (props: { code: TTableCode }) => {
        return _.cloneDeep(farmRepository.getTable(props))
    }

    const removeTable = (props: { code: TTableCode }) => {
        return farmRepository.removeTable(props)
    }

    const updateTable = (props: { table: TTable, code: TTableCode, headers: THeader[] }) => {
        return farmRepository.updateTable(props)
    }

    // Header
    const updateHeaders = (props: { code: TTableCode, headers: THeader[] }) => {
        return farmRepository.updateHeaders(props)
    }

    function getHeaders({ tableModel, code, types = [] }: { code?: TTableCode, tableModel?: { table: TTable, code?: TTableCode, headers: THeader[] }, types?: THeaderCellType[] }) {
        if (code) {
            return _.cloneDeep(farmRepository.getHeaders({ code }))
        }

        if (!tableModel) { return [] }

        if (types.length == 0) { return tableModel.code ? farmRepository.getHeaders({ code: tableModel.code }) : [] }

        const headers: THeader[] = []

        for (let k = 0; k < types.length; k++) {
            for (let j = 0; j < tableModel.headers.length; j++) {
                const _header = tableModel.headers[j]

                if (_header.type == types[k]) {
                    headers.push(_header)
                }
            }
        }

        return headers
    }

    // Setting
    const updateSetting = (props: { settings: ISettingsGeneral }) => {
        farmRepository.updateSetting(props.settings)
    }

    const getSettings: () => ISettingsFarm = () => {
        return _.cloneDeep(farmRepository.getSettings())
    }

    // Log
    const addLogs = (props: TLog[]) => {
        farmRepository.addLogs(props)
    }

    const addLog = (props: TLog) => {
        farmRepository.addLog(props)
    }

    const getLog = () => {
        return _.cloneDeep(farmRepository.getLog())
    }

    return {
        getData,
        uploadFilesPlants,
        getSelectionCriteria,
        processFarm,
        setup,
        reset,
        addTable,
        getTable,
        removeTable,
        updateTable,
        updateHeaders,
        getHeaders,
        updateSetting,
        getSettings,
        addLog,
        addLogs,
        getLog,
    }
}