function SettingControl(farmRepository: IFarmRepository) {
    const controlDB = ControlDataBase()

    const KEY = "setting"

    const updateSettings = (settings: ISettingsGeneral) => {
        controlDB.updateItem(KEY, settings)
    }

    const clearSettings = () => {
        controlDB.removeItem(KEY)
    }

    const getSettings: (where?: { storage?: Boolean, farm?: Boolean, global?: Boolean }, onlyWhere?: boolean) => { settings: (ISettingsGeneral | null) } = (where = { farm: false, storage: false, global: false }, onlyWhere = false) => {
        if (where.storage) {
            const settings = controlDB.getItem<ISettingsGeneral>(KEY, ["separatorLine"])

            if (onlyWhere) { return { settings } }

            return { settings: settings || _.cloneDeep(GLOBAL_SETTINGS) }
        }

        if (where.farm) {
            const set = _.cloneDeep(farmRepository.getSettings())

            if (onlyWhere) { return { settings: set.isActive ? set : null } }

            return { settings: set.isActive ? set : _.cloneDeep(GLOBAL_SETTINGS) }
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