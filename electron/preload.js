const { contextBridge, ipcRenderer } = require("electron");

const apiTokenArg = process.argv.find(arg => arg.startsWith('--api-token='));
const apiToken = apiTokenArg ? apiTokenArg.split('=')[1] : '';

contextBridge.exposeInMainWorld("electronAPI", {
    platform: process.platform,
    apiToken,
    windowControls: {
        minimize: () => ipcRenderer.send("window-minimize"),
        maximize: () => ipcRenderer.send("window-maximize"),
        close: () => ipcRenderer.send("window-close"),
    }
});
