function PreloadPanel(panel: HTMLElement) {
    const modelWindow = ModelWindowComponent()

    const forms = panel.querySelectorAll("form") as NodeListOf<HTMLElement>
    const models = panel.querySelectorAll("[model-window]") as NodeListOf<HTMLElement>

    forms.forEach(_form => _form.addEventListener("submit", ev => ev.preventDefault()))
    models.forEach(_model => {
        const header = _model.querySelector(".model-header") as HTMLElement
        modelWindow.setupMoveModel(header, _model)
    })
}