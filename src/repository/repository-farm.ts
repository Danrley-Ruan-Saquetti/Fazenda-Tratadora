function FarmRepository(): IFarmRepository {
    const data: IFarm = {
        tables: [], id: null, settings: _.cloneDeep({ ...GLOBAL_SETTINGS_RESET, isActive: false }),
        process: []
    }

    // Table
    const setup = (props: IFarm) => {
        data.tables = [...props.tables]
        data.id = props.id
        data.settings = { ..._.cloneDeep(props.settings), isActive: true }
        data.process = [..._.cloneDeep(props.process)]
    }

    const reset = () => {
        data.tables.splice(0, data.tables.length)
        data.process.splice(0, data.process.length)
        data.id = null
        data.settings = _.cloneDeep({ ...GLOBAL_SETTINGS_RESET, isActive: false })
    }

    const addTable = (tableModel: ITableModel, saveOld = false) => {
        !saveOld && removeTable(tableModel)

        data.tables.push(tableModel)
    }

    const getTable = ({ code }: { code: TTableCode }) => {
        return _.cloneDeep(data.tables.reduce((acc: ITableModelIndex, _table, index) => {
            if (_table.code == code) {
                acc.push({ ..._table, index })
            }
            return acc
        }, []))
    }

    const removeTable = ({ code }: { code: TTableCode }) => {
        const modelTable = getTable({ code })[0]

        if (!modelTable) { return false }

        data.tables.splice(modelTable.index, 1)

        return true
    }

    const updateTable = ({ code, headers: newHeaders, table: newTable }: { table: TTable, code: TTableCode, headers?: THeader[] }) => {
        const modelTable = getTable({ code })[0]

        if (!modelTable) { return false }

        if (newHeaders) {
            data.tables[modelTable.index].headers = newHeaders
        }
        data.tables[modelTable.index].table = newTable

        return true
    }

    // Header
    const updateHeaders = ({ code, headers: newHeaders }: { code: TTableCode, headers: THeader[] }) => {
        const modelTable = getTable({ code })[0]

        if (!modelTable) { return false }

        return updateTable({ code, table: modelTable.table, headers: newHeaders })
    }

    const getHeaders = ({ code, types = [], hasValue = true }: { code: TTableCode, types?: THeaderCellType[], hasValue?: boolean }) => {
        const modelTable = getTable({ code })[0]

        if (!modelTable) { return [] }

        if (types.length == 0) { return modelTable.headers }

        return _.cloneDeep(modelTable.headers.filter(_header => {
            if (!hasValue && _header.value) { return false }

            return types.includes(_header.type)
        }))
    }

    // Setting
    const updateSetting = (settings: ISettingsGeneral) => {
        data.settings = { ..._.cloneDeep(settings), isActive: true }
    }

    const getSettings = () => {
        return _.cloneDeep(data.settings)
    }

    // Process
    const updateProcess = (process: TFarmProcess[]) => {
        data.process = _.cloneDeep(process)
    }

    const getProcess = () => {
        return _.cloneDeep(data.process)
    }

    return {
        data,
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
        getProcess,
        updateProcess,
    }
}