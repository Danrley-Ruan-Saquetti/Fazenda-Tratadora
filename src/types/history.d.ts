type TypeDataHistory = { settings: ISettingsFarm, tables: ITableModel[], name: string, process: TFarmProcess[] }
type TypeHistory = { id: string, data: TypeDataHistory, parent: string | null, date: Date }
type IHistoryTable = TypeHistory[]
interface ITM extends ITableModel {
    index: number
}
type ITableModelIndex = ITM[]