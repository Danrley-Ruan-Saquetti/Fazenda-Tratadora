type TTable = string[][]
type TTableCode = "plant.price" | "plant.deadline" | "farm" | "template.price" | "template.deadline" | "template.rate"
type THeaderCellType = "selection-criteria" | "selection-criteria.value" | "cep.initial" | "cep.final" | "cep.origin.initial" | "cep.origin.final" | "excess" | "deadline" | "deadline+D" | "rate" | "weight" | "extra"
type THeader = { header: string, type: THeaderCellType, value?: string }
interface ITableModel { table: TTable, code: TTableCode, headers: THeader[], name: string }
interface IFarm { tables: ITableModel[], id: string | null, settings: ISettingsFarm, process: TFarmProcess[] }

declare interface IFarmRepository {
    data: IFarm;
    setup: (props: IFarm) => void;
    reset: () => void;
    addTable: (tableModel: ITableModel, saveOld?: boolean) => void;
    getTable: ({ code }: {
        code: TTableCode;
    }) => {
        table: TTable;
        code: TTableCode;
        headers: THeader[];
        name: string;
        index: number;
    }[];
    removeTable: ({ code }: {
        code: TTableCode;
    }) => boolean;
    updateTable: ({ code, headers: newHeaders, table: newTable }: {
        table: TTable;
        code: TTableCode;
        headers?: THeader[];
    }) => boolean;
    updateHeaders: ({ code, headers: newHeaders }: {
        code: TTableCode;
        headers: THeader[];
    }) => boolean;
    getHeaders: ({ code, types, hasValue }: {
        code: TTableCode;
        types?: THeaderCellType[] | undefined;
        hasValue?: boolean | undefined;
    }) => THeader[];
    updateSetting: (settings: ISettingsGeneral) => void;
    getSettings: () => ISettingsFarm;
    updateProcess: (process: TFarmProcess[]) => void;
    getProcess: () => TFarmProcess[];
};