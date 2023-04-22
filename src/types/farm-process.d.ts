type TFarmProcessType = "process-plant" | "prepare-environment" | "create-farm" | "insert-values" | "remove-character" | "deadline+D" | "contained-cep" | "procv" | "rate"

type TFarmProcessTypeSelection = "create-farm" | "insert-values" | "deadline+D" | "contained-cep" | "procv" | "rate"

type TProcessSituation = "canceled" | "interrupted" | "finalized" | ""

type TFarmProcess = { type: TFarmProcessType, logs: TLog[], situation?: TProcessSituation }
