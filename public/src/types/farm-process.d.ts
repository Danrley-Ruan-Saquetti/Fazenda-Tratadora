type TFarmProcessType = "process-plant" | "prepare-environment" | "create-farm" | "insert-values" | "remove-character" | "deadline+D" | "order-table" | "contained-cep" | "procv" | "template" | "rate"

type TFarmProcessTypeSelection = "create-farm" | "insert-values" | "deadline+D" | "contained-cep" | "procv" | "template" | "rate"

type TProcessSituation = "canceled" | "interrupted" | "finalized"

type TFarmProcess = { type: TFarmProcessType, logs: TLog[], situation?: TProcessSituation }
type TFarmProcessSelection = { type: TFarmProcessTypeSelection, logs: TLog[], situation?: TProcessSituation }