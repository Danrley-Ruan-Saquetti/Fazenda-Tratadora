function App() {
    if (GLOBAL_DEPENDENCE == "production") {
        const res = prompt("KEY")

        if (res !== "panoramasistemas") return
    }

    const renderControl = RenderControl()

    const initComponents = () => {
        Setup()

        renderControl.initComponents()
    }

    return initComponents()
}


window.onload = App