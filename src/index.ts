const { app, ipcMain } = require("electron")
const createWindow = require("./browser-window.js")

function App() {
    const win = createWindow({
        title: "Fazenda Tratadora",
        filePath: "./public/index.html",
        height: 650,
        width: 1050
    })

    win.webContents.openDevTools()

    ipcMain.on("hello", (ev, data) => {
        console.log(ev)
        console.log(data)
    })
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(App)