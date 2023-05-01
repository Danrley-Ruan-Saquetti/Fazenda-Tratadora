import { GLOBAL_HISTORY, GLOBAL_SETTINGS } from "../global.js"
import { FarmRepository } from "../repository/repository-farm.js"
import { clone, replaceText } from "../util/util.js"
import { FarmControl } from "./control-farm.js"
import { FileControl } from "./control-file.js"
import { HistoryTableControl } from "./control-history-table.js"
import { SettingControl } from "./control-setting.js"

export function MainControl() {
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
    const setupFarm = ({ plants, settings, process: processSelection }: { plants: { code: TTableCode, file: Blob, headers: THeader[], name: string }[], settings: ISettingsGeneral, process: TFarmProcessTypeSelection[] }, callback?: Function) => {
        const process = processSelection.map(_process => { return { type: _process, logs: [] } })

        farmControl.updateSetting({ settings })
        farmControl.setupProcess({ process })

        uploadFilesPlants({ plants }, callback)
    }

    const processRepoTable = (props: { settings: ISettingsGeneral, modelTables: ITableModel[], process: TFarmProcess[] }) => {
        return farmControl.processFarm(props) || null
    }

    const processFarm = () => {
        const plantDeadline = clone(farmControl.getTable({ code: "plant.deadline" })[0])
        const plantPrice = clone(farmControl.getTable({ code: "plant.price" })[0])
        const plantFarm = clone(farmControl.getTable({ code: "farm" })[0])

        const plants: ITableModel[] = []

        plantDeadline && plants.push(plantDeadline)
        plantPrice && plants.push(plantPrice)
        plantFarm && plants.push(plantFarm)

        const farm = processRepoTable({
            modelTables: plants,
            settings: settingControl.getSettings({ farm: true }).settings || settingControl.getSettings().settings || GLOBAL_SETTINGS,
            process: farmControl.getProcess()
        })

        console.log("$Finish")

        farm && farmControl.setup(farm)

        return farm || null
    }

    // History
    const saveFarm = (name: string) => {
        const { id } = historyTableControl.addHistory({ tables: farmControl.getData().tables, name, settings: farmControl.getData().settings, process: farmControl.getData().process }, farmControl.getData().id)

        if (!id) { return }

        farmControl.setup({ id, tables: farmControl.getData().tables, settings: farmControl.getData().settings, process: farmControl.getData().process })
    }

    const loadFarm = (id: string) => {
        const farm = historyTableControl.getData({ id })

        if (!farm.data) { return }

        farmControl.reset()
        farmControl.setup({ id: farm.id, tables: farm.data.tables, settings: farm.data.settings, process: farm.data.process })
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