import { HistoryTableControl } from "./controller/control-history-table.js"
import { SettingControl } from "./controller/control-setting.js"
import { GLOBAL_HISTORY, GLOBAL_SETTINGS } from "./global.js"
import { FarmRepository } from "./repository/repository-farm.js"

export function Setup() {
    const historyTableControl = HistoryTableControl()
    const settingControl = SettingControl(FarmRepository())

    if (!historyTableControl.getHistory().history) {
        historyTableControl.setup([...GLOBAL_HISTORY])
    }

    if (!settingControl.getSettings({ storage: true })) {
        settingControl.updateSettings(GLOBAL_SETTINGS)
    }
}