function SettingControl(farmRepository: IFarmRepository) {
    const controlDB = ControlDataBase()

    const KEY = "setting"

    const updateSettings = (settings: ISettingsGeneral) => {
        controlDB.updateItem(KEY, settings)
    }

    const clearSettings = () => {
        controlDB.removeItem(KEY)
    }

    const getSettings: (where?: { storage?: Boolean, farm?: Boolean, global?: Boolean }) => { settings: ISettingsGeneral } = (where = { farm: false, storage: false, global: false }) => {
        if (where.storage) return { settings: controlDB.getItem<ISettingsGeneral>(KEY, ["separatorLine"]) || GLOBAL_SETTINGS }

        if (where.farm) {
            const set = _.cloneDeep(farmRepository.getSettings())
            return { settings: set.isActive ? set : GLOBAL_SETTINGS }
        }

        if (where.global) return { settings: _.cloneDeep(GLOBAL_SETTINGS) }

        return { settings: controlDB.getItem<ISettingsGeneral>(KEY, ["separatorLine"]) || _.cloneDeep(GLOBAL_SETTINGS) || _.cloneDeep(farmRepository.getSettings()) }
    }

    return {
        updateSettings,
        getSettings,
        clearSettings,
    }
}