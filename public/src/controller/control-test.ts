import { FarmRepository } from "../repository/repository-farm.js"
import { FarmControl } from "./control-farm.js"
import { TableControl } from "./control-table.js"

function TestControl() {
    const farmRepository = FarmRepository()
    const farmControl = FarmControl(farmRepository)
    const tableControl = TableControl()

    const getRange = ({ table, headers, indexRow, settings }: { indexRow: number, table: TTable, headers: THeader[], settings: ISettingsFarm }) => {
        const tableHeaders: THeader[] = [...headers.filter(_header => { return _header.type != "selection-criteria" }).map(_header => { return _header })]
        const range: string[][] = [tableHeaders.map(_header => { return _header.header }), []]

        if (indexRow < 0) { return { table: [range[0], range[0].map(_a => { return "" })], headers: tableHeaders } }

        const headersCS: THeader[] = []

        for (let i = 0; i < headers.length; i++) {
            const _headers = headers[i]

            const indexColumn = tableControl.getIndex({ valueSearch: _headers.header, where: { array: table[0] } })

            if (indexColumn < 0) { continue }

            if (_headers.type == "selection-criteria") {
                headersCS.push(_headers)
                headers.splice(i, 0)

                continue
            }

            range[1].push(table[indexRow][indexColumn])
        }

        const cs = farmControl.getSelectionCriteria({ i: indexRow, headers: headersCS, table, settings })

        range[0].push("CS")
        range[1].push(cs)
        tableHeaders.push({ header: range[0][range[0].length - 1], type: "selection-criteria" })

        return { table: range, headers: tableHeaders }
    }

    const getIndexByCep = ({ cep, headers, table }: { table: TTable, headers: [{ header: string, type: "cep.initial", value?: string }, { header: string, type: "cep.final", value?: string }], cep: string }) => {
        if (!getIndexByCep || headers.length != 2) { return -1 }

        const indexColumnCepInitial = tableControl.getIndex({ valueSearch: headers[0].header, where: { array: table[0] } })
        const indexColumnCepFinal = tableControl.getIndex({ valueSearch: headers[1].header, where: { array: table[0] } })

        for (let i = 1; i < table.length; i++) {
            const cepInitial = table[i][indexColumnCepInitial]
            const cepFinal = table[i][indexColumnCepFinal]

            if (cep < cepInitial || cep > cepFinal) { continue }

            return i
        }

        return -1
    }

    const getRandomCep = ({ table, headers }: { table: TTable, headers: [{ header: string, type: "cep.initial", value?: string }, { header: string, type: "cep.final", value?: string }] }) => {
        const indexRange = Math.floor(Math.random() * (table.length - 1)) + 1

        const indexColumnCepInitial = tableControl.getIndex({ valueSearch: headers[0].header, where: { array: table[0] } })
        const indexColumnCepFinal = tableControl.getIndex({ valueSearch: headers[1].header, where: { array: table[0] } })

        const initial = Number(table[indexRange][indexColumnCepInitial])
        const final = Number(table[indexRange][indexColumnCepFinal])

        const value = Math.round(Math.random() * (final - initial)) + initial

        return `${value}`
    }

    return {
        getRandomCep,
        getRange,
        getIndexByCep,
    }
}

// const table = [
//     ["CEP INICIAL", "CEP FINAL", "UF", "TARIFA", "Prazo", "GRIS (%)", "ADV"],
//     ["69932000", "69932000", "AC", "I", "15", "0,85"],
//     ["69926000", "69926999", "AC", "C", "11", "0,66"],
//     ["69931000", "69931999", "AC", "I", "11", "0,85"],
//     ["69934000", "69934000", "AC", "I", "13", "0,85"],
//     ["88080000", "88089999", "SC", "C", "5", "0,66"],
//     ["88090000", "88099999", "SC", "C", "5", "0,66"],
//     ["89267000", "89269999", "SC", "C", "5", "0,66"],
//     ["88385000", "88385999", "SC", "I", "5", "0,85"],
//     ["88430000", "88430999", "SC", "I", "6", "0,85"],
//     ["89870000", "89870999", "SC", "I", "6", "0,85"],
//     ["89882000", "89882999", "SC", "I", "5", "0,85"],
//     ["19800001", "19819999", "SP", "I", "6", "0,85"],
//     ["12940000", "12954999", "SP", "C", "4", "0,66"],
//     ["15350000", "15350999", "SP", "I", "8", "0,85"],
//     ["16360000", "16360999", "SP", "I", "6", "0,85"],
//     ["18700000", "18709999", "SP", "C", "5", "0,66"],
//     ["77600000", "77600999", "TO", "I", "9", "0,85"],
//     ["77500000", "77500999", "TO", "I", "9", "0,85"],
//     ["77501000", "77501000", "TO", "C", "14", "0,85"]
// ]

// const headers: THeader[] = [
//     { header: "CEP INICIAL", type: "cep.initial" },
//     { header: "CEP FINAL", type: "cep.final" },
//     { header: "Prazo", type: "deadline" },
//     { header: "UF", type: "selection-criteria" },
//     { header: "TARIFA", type: "selection-criteria" },
//     { header: "GRIS (%)", type: "rate" },
// ]

// farmRepository.addTable({
//     code: "farm",
//     name: "",
//     headers,
//     table: table
// })

// const testControl = TestControl()

// const { settings } = SettingControl().getSettings({ farm: true })

// const cepRandom = testControl.getRandomCep({ headers: [{ header: "CEP INICIAL", type: "cep.initial" }, { header: "CEP FINAL", type: "cep.final" }], table })
// const indexRange = testControl.getIndexByCep({ headers: [{ header: "CEP INICIAL", type: "cep.initial" }, { header: "CEP FINAL", type: "cep.final" }], cep: cepRandom, table })
// const rangeCep = testControl.getRange({ table, headers, indexRow: indexRange, settings })

// console.log(rangeCep, cepRandom)