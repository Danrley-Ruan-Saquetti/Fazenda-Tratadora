"use strict";
var _a = require("electron"), app = _a.app, ipcMain = _a.ipcMain;
var createWindow = require("./browser-window.js");
function App() {
    var win = createWindow({
        title: "Fazenda Tratadora",
        filePath: "./public/index.html",
        height: 650,
        width: 1050
    });
    win.webContents.openDevTools();
    ipcMain.on("hello", function (ev, data) {
        console.log(ev);
        console.log(data);
    });
}
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        app.quit();
});
app.whenReady().then(App);
