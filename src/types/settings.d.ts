interface ISettingsTemplateRateValue {
    "cep.origin.initial": string
    "cep.origin.final": string
}
interface ISettingsTemplateCepOriginValue {
    "cep.origin.initial": string
    "cep.origin.final": string
}
interface ISettingsTemplateHeaderName {
    "cep.origin.initial": string
    "cep.origin.final": string
    "cep.initial": string
    "cep.final": string
    "deadline+D": string
    "excess": string
    "deadline"?: string
    "weight"?: string
    "selection-criteria"?: string
    "selection-criteria.value"?: string
    "rate"?: string
    "extra"?: string
}
interface ISettingsConverterStringTable {
    separatorLine: string | RegExp,
    separatorColumn: string,
    configSeparatorColumn: {
        separator: string,
        searchValue: string,
        replaceValue: string,
        betweenText: string,
    }
}
interface ISettingsHeadersTable {
    "cep.initial": string,
    "cep.final": string,
    deadline: string,
    excess: string,
    rate: {
        deadline: string,
        price: string
    },
    "selection.criteria": {
        price: string,
        deadline: string
    }
}
// interface ISettingsTable {
//     table: ISettingsHeadersTable
// }
interface ISettingsTableTemplate {
    template: {
        rateValue: ISettingsTemplateRateValue
        headerName: ISettingsTemplateHeaderName
        cepOriginValue: ISettingsTemplateCepOriginValue
    }
}
interface ISettingsProcessConfig {
    process: {
        "deadline+D": number,
        "criteria.selection": { join: string }
        converterStringTable: ISettingsConverterStringTable,
    }
}
type TSettingsPlant = { code: TTableCode, file: Blob, headers: THeader[], name: string }
type TSettingsPlantTemplate = { code: TTableCode, file?: Blob, headers: THeader[], name: string }
interface ISettingsPlant {
    plants: TSettingsPlant[]
}
interface ISettingsPlantTemplate {
    plants: TSettingsPlantTemplate[]
}
interface ISettingsProcess {
    process: TFarmProcessTypeSelection[]
}
interface ISettingsGeneral extends ISettingsProcessConfig, ISettingsTableTemplate, ISettingsPlant { }
interface ISettingsAdvanced extends ISettingsProcessConfig, ISettingsTableTemplate { }
interface ISettingsFarm extends ISettingsGeneral { isActive?: Boolean }
interface ISettingsTemplate extends ISettingsProcess { settings: ISettingsGeneral }
interface ISettingsForm extends ISettingsProcess { settings: ISettingsProcessConfig & ISettingsTableTemplate & ISettingsPlantTemplate }