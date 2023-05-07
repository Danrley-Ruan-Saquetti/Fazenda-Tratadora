function Setup() {
    const historyTableControl = HistoryTableControl()
    const settingControl = SettingControl(FarmRepository())

    if (!historyTableControl.getHistory().history) {
        historyTableControl.setup([...GLOBAL_HISTORY])
    }

    if (!settingControl.getSettings({ storage: true }, true).settings) {
        settingControl.updateSettings(GLOBAL_SETTINGS)
    }
}