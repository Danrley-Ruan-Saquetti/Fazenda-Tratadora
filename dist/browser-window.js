"use strict";
var BrowserWindow = require('electron').BrowserWindow;
function createBrowserWindow(_a) {
    var height = _a.height, title = _a.title, width = _a.width, filePath = _a.filePath, fullScreen = _a.fullScreen;
    var win = new BrowserWindow({
        width: width,
        height: height,
        title: title,
        darkTheme: true,
        show: true,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
        }
    });
    win.loadFile(filePath || "");
    win.setFullScreen(fullScreen || false);
    return win;
}
module.exports = { createWindow: createBrowserWindow };
