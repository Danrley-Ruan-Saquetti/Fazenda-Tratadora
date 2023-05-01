import { PreloadPanel } from "./preload.js"

export function GuideScript(idPanel: string) {
    const panel = document.querySelector(`[panel="guide"][id="${idPanel}"]`) as HTMLElement

    if (!panel) { return { error: { msg: "Panel not found" } } }

    const initComponents = () => {
        PreloadPanel(panel)

    }

    initComponents()

    return {}
}