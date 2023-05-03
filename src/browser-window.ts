const { BrowserWindow } = require('electron')

function createBrowserWindow({ height, title, width, filePath, fullScreen }: { title: string, width: number, height: number, filePath: string, fullScreen?: boolean }) {
    const win = new BrowserWindow({
        width,
        height,
        title,
        darkTheme: true,
        show: true,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
        }
    })

    win.loadFile(filePath || "")

    win.setFullScreen(fullScreen || false)

    return win
}

module.exports = { createWindow: createBrowserWindow }