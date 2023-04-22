interface IScript {
    FarmScript: (idPanel: string) => (any | { error: { msg: string } })
    HistoryScript: (idPanel: string) => (any | { error: { msg: string } })
    TestScript: (idPanel: string) => (any | { error: { msg: string } })
    SettingScript: (idPanel: string) => (any | { error: { msg: string } })
    FeatureScript: (idPanel: string) => (any | { error: { msg: string } })
}