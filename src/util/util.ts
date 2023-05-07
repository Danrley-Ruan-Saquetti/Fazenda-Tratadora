function isNumber(str: string) { return !isNaN(parseFloat(str)) }

function generatedId() {
    const VALUE_MAX = 9999
    const now = new Date()

    return `${now.getFullYear()}${`${now.getMonth() + 1}`.padStart(2, "0")}${`${Math.floor(Math.random() * VALUE_MAX)}`.padStart(`${VALUE_MAX}`.length, "0")}`
}

function replaceText({ replaceValue, searchValue, val, betweenText }: { val: string, searchValue: string, replaceValue: string, betweenText?: string }) {
    let value = val

    if (!value) { return "" }

    if (!betweenText) {
        do {
            value = value.replace(searchValue, replaceValue)
        } while (value.indexOf(searchValue) >= 0)

        return value
    }

    let i = 0
    let isOpenQuote = false
    do {
        const index = value.indexOf(betweenText, i)

        if (index < 0) { break }

        if (!isOpenQuote) isOpenQuote = true
        else {
            value = value.substring(0, i) + value.substring(i, index).replace(searchValue, replaceValue) + value.substring(index)

            isOpenQuote = false
        }

        i = index + 1
    } while (i < value.length);

    return value
}

function processObjToJSON<T>(obj: T) {
    const newObj = _.cloneDeep(obj)

    for (const key in newObj) {
        if (newObj[key] instanceof RegExp) {
            // @ts-expect-error
            newObj[key] = converterReGexpToString(newObj[key])
            continue
        }
        if (typeof newObj[key] === "object" && newObj[key] !== null) {
            newObj[key] = processObjToJSON(newObj[key])
        }
    }

    return newObj
}

function processJSONToObj<T>(obj: T, keysRegExp: string[] = []) {
    const newObj = _.cloneDeep(obj)

    for (const key in newObj) {
        if (keysRegExp.includes(`${key}`) && typeof newObj[key] === "string") {
            try {
                // @ts-expect-error
                newObj[key] = converterStringToRegExp(newObj[key])
            } catch (e) { }
        }
        if (typeof newObj[key] === "object" && newObj[key] !== null) {
            newObj[key] = processJSONToObj(newObj[key], keysRegExp)
        }
    }

    return newObj
}

function converterReGexpToString(value: RegExp) {
    return `${value}`
}

function converterStringToRegExp(value: string) {
    return new RegExp(value.slice(1, -1))
}

function converterStringToJSON<T>(str: string, keysRegExp?: string[]): T | null {
    try {
        return processJSONToObj(JSON.parse(str), keysRegExp)
    } catch (err) {
        console.log(err)
        return null
    }
}

function converterJSONToString(str: object): string | null {
    try {
        return JSON.stringify(processObjToJSON(str))
    } catch (err) {
        return null
    }
}

function deepEqual(obj1: any, obj2: any, exclude: string[] = []) {
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    if (keys1.length !== keys2.length) { return false }

    keys1.sort()
    keys2.sort()

    for (let i = 0; i < keys1.length; i++) {
        if (exclude.includes(keys1[i])) { continue }

        if (keys1[i] != keys2[i]) { return false }
    }

    return true
}