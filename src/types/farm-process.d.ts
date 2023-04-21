type TFarmProcessType = "insert-values" | "remove-character" | "deadline+D" | "contained-cep" | "procv" | "rate"

type TProcessSituation = "canceled" | "interrupted" | "finalized"

type TFarmProcess = { type: TFarmProcess, logs: TLog[], situation: TProcessSituation }
