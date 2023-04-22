function App() {
    const renderControl = RenderControl()

    const initComponents = () => {
        Setup()

        renderControl.initComponents()
    }

    return initComponents()
}

window.onload = App