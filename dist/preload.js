"use strict";
var _a = require("electron"), contextBridge = _a.contextBridge, ipcRenderer = _a.ipcRenderer;
contextBridge.exposeInMainWorld("api", {
    getExpressAppUrl: function () { return ipcRenderer.invoke("get-express-app-url"); }
});
contextBridge.exposeInMainWorld("ipcRenderer", {
    on: function (channel, listener) {
        ipcRenderer.on(channel, listener);
    }
});
