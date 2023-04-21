type TFarmProcess = "insert-values" | "remove-character" | "deadline+D" | "contained-cep" | "procv" | "rate"

interface IFarmProcess {
    process: {
        type: TFarmProcess
    }[]
}