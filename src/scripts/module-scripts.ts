const GLOBAL_MODULE_SCRIPTS: IScript = {
    FarmScript: FarmScript,
    HistoryScript: HistoryScript,
    TestScript: (id: string) => { return { error: { msg: 'Router "Test" not found' } } }
}