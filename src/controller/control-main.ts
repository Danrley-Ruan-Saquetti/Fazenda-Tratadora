function MainControl() {
    const farmRepository = FarmRepository()
    const historyTableControl = HistoryTableControl()
    const settingControl = SettingControl(farmRepository)
    const fileControl = FileControl(farmRepository)
    const farmControl = FarmControl(farmRepository)

    const getData = (id?: string) => {
        console.log(`Panel=${id}`)
        console.log({ farm: farmControl.getData() })
        console.log(historyTableControl.getHistory())
        console.log(settingControl.getSettings({ farm: true }).settings ? settingControl.getSettings({ farm: true }) : settingControl.getSettings({ global: true }))
        console.log("")

        return farmControl.getData()
    }

    // File
    const uploadFilesPlants = (props: { plants: { code: TTableCode, file: Blob, headers: THeader[], name: string }[] }, callback?: Function) => {
        farmControl.uploadFilesPlants(props, callback)
    }

    const getContentFile = (file: Blob, onload: (result: string) => void, onerror?: (() => void)) => {
        return fileControl.getContentFile(file, onload, onerror)
    }

    const exportFiles = ({ files, callback }: { files: { file: any, name: string }[], callback: (url: string) => void }) => {
        const filesZip: { file: Blob, name: string }[] = []

        for (let i = 0; i < files.length; i++) {
            const file = files[i]

            const fileBlob = fileControl.createFile({ content: [file.file] })

            filesZip.push({ file: fileBlob, name: file.name || "?" })
        }

        const zip = fileControl.createFileZip({ files: filesZip })

        zip.generateAsync({ type: "blob" }).then((zipBlob: Blob) => {
            const url = fileControl.createObjectURL(zipBlob)

            callback(url)
        })
    }

    const createURLDownload = (callback: (url: string, name: string) => void, files: { file: any, name: string }[]) => {
        const now = new Date(Date.now())

        const date = replaceText({ replaceValue: ".", searchValue: "/", val: now.toLocaleDateString('pt-br') })

        const hour = `${now.getHours().toString().padStart(2, "0")}.${now.getMinutes().toString().padStart(2, "0")}`

        const zipName = `${date} - ${hour}.zip`

        exportFiles({ files, callback: (url) => callback(url, zipName) })
    }

    const createFile = (props: { content: BlobPart[], charset?: string, type?: string }) => {
        return fileControl.createFile(props)
    }

    const downloadCurrentFarm = (callback: (url: string, name: string) => void) => {
        const farm = farmControl.getData().tables

        const files: { file: any, name: string }[] = []

        for (let i = 0; i < farm.length; i++) {
            const _farm = farm[i]

            if (!_farm) { continue }

            const file = fileControl.getContentInFormatCSV(_farm.table)

            files.push({ file: file, name: _farm.name })
        }

        createURLDownload(callback, files)
    }

    const prepareForDownload = (name = "") => {
        downloadCurrentFarm((url, zipName) => {
            const tagDownload = document.getElementById("download-files")

            if (!tagDownload) { return }

            tagDownload.setAttribute("href", url)
            tagDownload.setAttribute("download", `Fazenda - ${name ? `${name} ` : ``}${zipName}`)
        })
    }

    // Table
    const setupFarm = ({ plants, settings }: { plants: { code: TTableCode, file: Blob, headers: THeader[], name: string }[], settings: ISettingsGeneral }, callback?: Function) => {
        farmControl.updateSetting({ settings })

        uploadFilesPlants({ plants }, callback)
    }

    const processRepoTable = ({ settings, modelTables }: { settings: ISettingsGeneral, modelTables: ITableModel[] }) => {
        return farmControl.processFarm({ modelTables, settings }) || null
    }

    const processFarm = () => {
        const farm = processRepoTable({
            modelTables: [
                { ..._.cloneDeep(farmControl.getTable({ code: "plant.deadline" })[0]) },
                { ..._.cloneDeep(farmControl.getTable({ code: "plant.price" })[0]) }
            ],
            settings: settingControl.getSettings({ farm: true }).settings || settingControl.getSettings().settings || GLOBAL_SETTINGS
        })

        farmControl.setup(farm)

        console.log("$Finish")

        return farm
    }

    // History
    const saveFarm = (name: string) => {
        const { id } = historyTableControl.addHistory({ tables: farmControl.getData().tables, name, settings: farmControl.getData().settings, logs: farmControl.getData().logs }, farmControl.getData().id)

        if (!id) { return }

        farmControl.setup({ id, tables: farmControl.getData().tables, settings: farmControl.getData().settings, logs: farmControl.getData().logs })
    }

    const loadFarm = (id: string) => {
        const farm = historyTableControl.getData({ id })

        if (!farm.data) { return }

        farmControl.reset()
        farmControl.setup({ id: farm.id, tables: farm.data.tables, settings: farm.data.settings, logs: farm.data.logs })
    }

    const clearFarm = () => {
        farmControl.reset()
    }

    const clearHistory = () => {
        historyTableControl.clearHistory()
        historyTableControl.setup(GLOBAL_HISTORY)
    }

    // Setting
    const clearSettings = () => {
        settingControl.clearSettings()
        settingControl.updateSettings(GLOBAL_SETTINGS)
    }

    return {
        getData,
        uploadFilesPlants,
        processFarm,
        getContentFile,
        processRepoTable,
        exportFiles,
        saveFarm,
        loadFarm,
        clearHistory,
        createURLDownload,
        createFile,
        downloadCurrentFarm,
        clearFarm,
        clearSettings,
        prepareForDownload,
        setupFarm,
    }
}