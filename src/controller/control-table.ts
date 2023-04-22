function TableControl() {

    const converterStringForTable = ({ value, configSeparatorColumn, separatorColumn, separatorLine }: { value: string, separatorLine: string | RegExp, separatorColumn: string, configSeparatorColumn: { searchValue: string, replaceValue?: string, betweenText?: string } }) => {
        if (!value) { return [] }

        const table: TTable = []
        const ABC = "abcdefghijklmnopqrstuvwxyv"
        const MAP_REPLACE_VALUE = "!@#$%&*()-=_+§|\\//{}[]^~`´ºª:;<>,.?" + ABC + ABC.toUpperCase()

        const replaceValue = configSeparatorColumn.replaceValue || (function () {
            for (let i = 0; i < MAP_REPLACE_VALUE.length; i++) {
                const character = MAP_REPLACE_VALUE[i]

                if (!value.includes(character)) {
                    return character
                }
            }

            return null
        }())

        if (!replaceValue) { return [] }

        value.split(separatorLine).forEach(line => {
            const columns = !configSeparatorColumn ? line.split(separatorColumn) : replaceText({ val: line, searchValue: separatorColumn, replaceValue, betweenText: configSeparatorColumn.betweenText }).split(separatorColumn)

            table.push(columns)
        })

        table.forEach((line, i) => {
            line.forEach((column, j) => {
                table[i][j] = replaceText({ val: column, searchValue: replaceValue, replaceValue: configSeparatorColumn.searchValue })
            })
        })

        return table
    }

    function getIndex({ valueSearch, where, options, method = "filled" }: { valueSearch: string, where: { table?: TTable, array?: string[], cell?: string }, method?: "some" | "filled", options?: { line?: number, column?: number } }) {
        if (!valueSearch || !where) { return -1 }

        if (where.table) {
            if (!options) { return -1 }

            if (typeof options.line != "undefined") {
                for (let j = 0; j < where.table[options.line].length; j++) {
                    const el = where.table[options.line][j]

                    const index = method == "some" ? el.indexOf(valueSearch) : el == valueSearch ? j : -1

                    if (index >= 0) { return index }
                }
            }

            for (let i = 0; i < where.table.length; i++) {
                if (typeof options.column != "undefined") {
                    const el = where.table[i][options.column]

                    const index = method == "some" ? el.indexOf(valueSearch) : el == valueSearch ? i : -1

                    if (index >= 0) { return index }
                }

                for (let j = 0; j < where.table[i].length; j++) {
                    const el = where.table[i][j]

                    const index = method == "some" ? el.indexOf(valueSearch) : el == valueSearch ? j : -1

                    if (index >= 0) { return index }
                }
            }
        }
        if (where.array) {
            for (let i = 0; i < where.array.length; i++) {
                const el = where.array[i]

                const index = method == "some" ? el.indexOf(valueSearch) : el == valueSearch ? i : -1

                if (index >= 0) { return index }
            }

            return -1
        }
        if (where.cell) {
            const index = method == "some" ? where.cell.indexOf(valueSearch) : where.cell == valueSearch ? 0 : -1

            if (index >= 0) { return index }
        }

        return -1
    }

    const copyTable = ({ tablePlant }: { tablePlant: TTable }) => {
        const tableCopied: TTable = []

        for (let i = 0; i < tablePlant.length; i++) {
            const row = []

            for (let j = 0; j < tablePlant[i].length; j++) {
                const cell = tablePlant[i][j]

                row.push(cell)
            }

            tableCopied.push(row)
        }

        return tableCopied
    }

    const getTableFiltering = ({ indexColumn, table: tableBase, value }: { table: TTable, indexColumn: number, value: string }) => {
        const table: TTable = []

        for (let i = 0; i < tableBase.length; i++) {
            if (tableBase[i][indexColumn] == value) {
                table.push(tableBase[i])
            }
        }

        return table
    }

    const getDistinctColumnValues = ({ columnIndex, table, excludes = { line: -1 } }: { table: string[][], columnIndex: number, excludes?: { line?: number } }) => {
        const column = table.map(row => row[columnIndex])

        return column.filter((value, index, self) => {
            if (excludes.line == index) { return false }

            return self.indexOf(value) === index
        })
    }

    const addColumn = ({ table, header = "", index, value = "" }: { table: TTable, header?: string, value?: string, index?: number }) => {
        if (index) table[0].splice(index, 0, header)
        else table[0].push(header)

        for (let i = 1; i < table.length; i++) {
            if (index) table[i].splice(index, 0, value)
            else table[i].push(value)
        }
    }

    const removeCharacter = ({ characters, table, options }: { table: TTable, characters: string[], options?: { specific: { line?: number, column?: number }, excludes?: { line?: number[], column?: number[] } } }) => {
        if (options && options.specific) {
            if (typeof options.specific.line != "undefined") {
                for (let j = 0; j < table[options.specific.line].length; j++) {
                    if (options.excludes && options.excludes.column && options.excludes.column.indexOf(j) >= 0) { continue }

                    for (let k = 0; k < characters.length; k++) {
                        const character = characters[k]

                        table[options.specific.line][j] = replaceText({ val: table[options.specific.line][j], searchValue: character, replaceValue: "" })
                    }
                }
                return true
            }
            if (typeof options.specific.column != "undefined") {
                for (let i = 0; i < table.length; i++) {
                    if (options.excludes && options.excludes.line && options.excludes.line.indexOf(i) >= 0) { continue }

                    for (let k = 0; k < characters.length; k++) {
                        const character = characters[k]

                        table[i][options.specific.column] = replaceText({ val: table[i][options.specific.column], searchValue: character, replaceValue: "" })
                    }
                }
            }

            return true
        }

        for (let i = 0; i < table.length; i++) {
            if (options && options.excludes && options.excludes.line && options.excludes.line.indexOf(i) >= 0) { continue }

            for (let j = 0; j < table[i].length; j++) {
                if (options && options.excludes && options.excludes.column && options.excludes.column.indexOf(j) >= 0) { continue }

                for (let k = 0; k < characters.length; k++) {
                    const character = characters[k]

                    table[i][j] = replaceText({ val: table[i][j], searchValue: character, replaceValue: "" })
                }
            }
        }
        return true
    }

    const orderTable = ({ column, table }: { table: TTable, column: number }) => {
        const headers = table[0]

        const _table = table.slice(1)

        const _tableOrdered = _table.sort(function (a, b) {
            return Number(a[column]) - Number(b[column]);
        })

        _tableOrdered.unshift(headers)

        return _tableOrdered
    }

    return {
        converterStringForTable,
        copyTable,
        getIndex,
        getTableFiltering,
        getDistinctColumnValues,
        addColumn,
        removeCharacter,
        orderTable,
    }
}