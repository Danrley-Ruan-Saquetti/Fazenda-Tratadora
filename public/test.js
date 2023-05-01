const { ipcRenderer } = require("electron")

ipcRenderer.send("hello", "world")