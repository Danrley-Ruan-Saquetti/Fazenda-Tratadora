let isConnected = true

function App() {
    const renderControl = RenderControl()

    const initComponents = () => {
        Setup()

        renderControl.initComponents()
    }

    return isConnected && initComponents()
}

window.onload = App