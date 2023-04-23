function HistoryTableControl() {
    const controlDB = ControlDataBase()
    const KEY = "history"

    const setup = (value?: IHistoryTable) => {
        controlDB.updateItem(KEY, value)
    }

    const addHistory = (data: TypeDataHistory, parent: string | null = null) => {
        const history: IHistoryTable = controlDB.getItem<IHistoryTable>(KEY) || [...GLOBAL_HISTORY]

        if (!history) { return { id: null } }

        const dataModel = { data, id: generatedId(), parent: parent || null, date: new Date(Date.now()) }

        history.push(dataModel)

        console.log(history)

        controlDB.updateItem(KEY, history)

        return { id: dataModel.id }
    }

    const clearHistory = () => {
        controlDB.removeItem(KEY)
    }

    const getData = ({ id }: { id?: string }) => {
        const history: IHistoryTable | null = controlDB.getItem<IHistoryTable>(KEY)

        if (!history || !id) { return { data: null, index: null, id: null, parent: null, date: null } }

        for (let i = 0; i < history.length; i++) {
            if (history[i].id != id) { continue }

            return { ...history[i], index: i }
        }

        return { data: null, index: null, id: null, parent: null, date: null }
    }

    const getHistory = () => {
        const history: IHistoryTable = controlDB.getItem<IHistoryTable>(KEY, ["separatorLine"]) || GLOBAL_HISTORY

        return { history }
    }

    const getPreviousVersion = (parent: string) => {
        const { history } = getHistory()

        if (!parent || !history) { return null }

        for (let i = history.length - 1; i >= 0; i--) {
            const _ver = history[i]

            if (_ver.id != parent) { continue }

            return _ver
        }

        return null
    }

    const getNewVersions = (id: string) => {
        const { history } = getHistory()

        const versions: IHistoryTable = []

        if (!id || !history) { return [] }

        for (let i = 0; i < history.length; i++) {
            const _ver = history[i]

            if (_ver.parent != id) { continue }

            versions.push(_ver)
        }

        return versions
    }

    const getVersion = ({ id, indicator }: { id?: string, indicator: "previous" | "_new" }) => {
        const { parent: parentRef, id: idVersionRef } = getData({ id })

        const { history } = getHistory()

        if (!history) { return [] }

        const actions = {
            previous: () => {
                if (!parentRef) { return [] }

                const lastVersion = getPreviousVersion(parentRef)

                return [lastVersion]
            },
            _new: () => {
                if (!idVersionRef) { return [] }

                return getNewVersions(idVersionRef)
            }
        }

        return actions[indicator] ? actions[indicator]() : []
    }

    const updateHistory = (id: string, value: TypeDataHistory) => {
        const { index } = getData({ id })

        if (!index) { return false }

        addHistory(value, id)

        return true
    }

    return {
        addHistory,
        getHistory,
        updateHistory,
        getVersion,
        getData,
        clearHistory,
        setup,
    }
}