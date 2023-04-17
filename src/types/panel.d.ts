type TScriptPanel = "FarmScript" | "HistoryScript" | "TestScript"
interface IScript {
    FarmScript: (idPanel: string) => (any | { error: { msg: string } })
    HistoryScript: (idPanel: string) => (any | { error: { msg: string } })
    TestScript: (idPanel: string) => (any | { error: { msg: string } })
}