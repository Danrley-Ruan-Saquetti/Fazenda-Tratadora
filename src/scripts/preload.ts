function PreloadPanel(panel: HTMLElement) {
    const forms = panel.querySelectorAll("form") as NodeListOf<HTMLElement>

    forms.forEach(_form => _form.addEventListener("submit", ev => ev.preventDefault()))
}