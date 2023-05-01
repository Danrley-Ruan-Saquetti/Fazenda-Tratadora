import { FarmScript } from "./script-farm.js"
import { FeatureScript } from "./script-feature.js"
import { GuideScript } from "./script-guide.js"
import { HistoryScript } from "./script-history.js"

export const GLOBAL_MODULE_SCRIPTS: IScript = {
    ["FarmScript"]: FarmScript,
    ["HistoryScript"]: HistoryScript,
    ["FeatureScript"]: FeatureScript,
    ["TestScript"]: (id: string) => { return { error: { msg: 'Router "Test" not found' } } },
    ["SettingScript"]: (id: string) => { return { error: { msg: 'Router "Setting" not found' } } },
    ["GuideScript"]: GuideScript
}