
// const indexCepInitial = tableControl.getIndex({ valueSearch: getHeaders({ tableModel: { table: modelTableFarm.table, headers: headersFarm }, types: ["cep.initial"] })[0]?.header, where: { array: modelTableFarm.table[0] } })
// const indexCepFinal = tableControl.getIndex({ valueSearch: getHeaders({ tableModel: { table: modelTableFarm.table, headers: headersFarm }, types: ["cep.final"] })[0]?.header, where: { array: modelTableFarm.table[0] } })

// if (indexCepInitial < 0 || indexCepFinal < 0) {
//     return repoControl.getData()
// }

// tableControl.removeCharacter({ table: modelTableFarm.table, character: "-", options: { specific: { column: indexCepInitial }, excludes: { line: [0] } } })
// tableControl.removeCharacter({ table: modelTableFarm.table, character: "-", options: { specific: { column: indexCepFinal }, excludes: { line: [0] } } })

// const { logs: logsInsertValuesDMoreOne } = insertValuesDMoreOne({ tableModel: { table: modelTableFarm.table, headers: headersFarm }, tableBase: { table: modelTablePlantDeadline.table, headers: headersPlantDeadline }, settings })

// modelTableFarm.table = tableControl.orderTable({ table: modelTableFarm.table, column: indexCepInitial })

// const { logs: logsValidateContainedCEP } = validateContainedCEP({ table: { table: modelTableFarm.table, code: "farm", headers: headersFarm } })

// const headersTemplateDeadline: THeader[] = [
//     ...getHeaders({ tableModel: { table: modelTablePlantDeadline.table, code: "plant.deadline", headers: headersPlantDeadline }, types: ["cep.origin.initial", "cep.origin.final"] }),
//     ...getHeaders({ tableModel: { table: modelTableFarm.table, code: "farm", headers: headersFarm }, types: ["cep.initial", "cep.final", "deadline+D"] }),
// ]
// const headersTemplatePrice: THeader[] = [
//     ...getHeaders({ tableModel: { table: modelTablePlantDeadline.table, code: "plant.deadline", headers: headersPlantDeadline }, types: ["cep.origin.initial", "cep.origin.final"] }),
//     ...getHeaders({ tableModel: { table: modelTableFarm.table, code: "farm", headers: headersFarm }, types: ["cep.initial", "cep.final", "excess"] }),
//     ...getHeadersWeight({ table: [modelTableFarm.table[0]] }),
// ]

// const headersTemplateRate: THeader[] = [
//     { header: settings.template.headerName["cep.origin.initial"], type: "cep.origin.initial", value: settings.template.rateValue["cep.origin.initial"] },
//     { header: settings.template.headerName["cep.origin.final"], type: "cep.origin.final", value: settings.template.rateValue["cep.origin.final"] },
//     ...getHeaders({ tableModel: modelTablePlantDeadline, types: ["cep.initial", "cep.final"] })
// ]

// const { logs: logsInsertProcvValues } = insertProcvValues({ tableModel: { table: modelTableFarm.table, code: "farm", headers: headersFarm }, tableBase: { table: modelTablePlantPrice.table, code: "plant.price", headers: headerPlantValuePriceToFarm }, headers: headerPlantValuePriceToFarm, settings })

// const { modelTable: modelTableTemplateDeadline, logs: logsTableTableTemplateDeadline } = createTemplate({ code: "template.deadline", headers: headersTemplateDeadline, tableBase: modelTableFarm.table, name: "Template Prazo", settings })
// const { modelTable: modelTableTemplatePrice, logs: logsTableTableTemplatePrice } = createTemplate({ code: "template.price", headers: headersTemplatePrice, tableBase: modelTableFarm.table, name: "Template Preço", settings })

// const headersRate = [
//     ...getHeaders({ tableModel: modelTablePlantDeadline, types: ["rate"] }),
//     ...getHeaders({ tableModel: modelTablePlantPrice, types: ["rate"] }),
// ]

// for (let c = 0; c < headersRate.length; c++) {
//     const _headerRate = headersRate[c]

//     const indexHeader = tableControl.getIndex({ valueSearch: _headerRate.header, where: { array: modelTableFarm.table[0] } })

//     if (indexHeader < 0) { continue }

//     const rateValues = tableControl.getDistinctColumnValues({ table: modelTableFarm.table, columnIndex: indexHeader, excludes: { line: 0 } })

//     if (rateValues.length == 1) {
//         const name = `Template Taxa - ${replaceText({ val: replaceText({ val: _headerRate.header + " " + rateValues[0], searchValue: `"`, replaceValue: "" }), searchValue: `/`, replaceValue: "" })} _G`

//         const modelTable: ITableModel = { table: [], headers: [], code: "template.rate", name }

//         repoControl.addTable({ tableModel: modelTable, saveOld: true })

//         continue
//     }

//     for (let c = 0; c < rateValues.length; c++) {
//         const _rateValue = rateValues[c]

//         if (!_rateValue || (isNumber(_rateValue) && Number(_rateValue) <= 0)) { continue }

//         const name = `Template Taxa - ${replaceText({ val: replaceText({ val: _headerRate.header + " " + _rateValue, searchValue: `"`, replaceValue: "" }), searchValue: `/`, replaceValue: "" })} _N`

//         const { modelTable: modelTableTemplateRate, logs: logsCreateTemplateRate } = createTemplateRate({ tableBase: modelTableFarm.table, code: "template.rate", name, headers: [...headersTemplateRate, _headerRate], value: _rateValue, settings })

//         if (!modelTableTemplateRate) { continue }

//         repoControl.addTable({ tableModel: modelTableTemplateRate, saveOld: true })
//     }
// }

// repoControl.addTable({ tableModel: modelTableTemplateDeadline })
// repoControl.addTable({ tableModel: modelTableTemplatePrice })