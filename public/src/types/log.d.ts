type TLogType = "success" | "info" | "warning" | "alert" | "error"
type TLog = { type: TLogType, message: string, date?: Date }