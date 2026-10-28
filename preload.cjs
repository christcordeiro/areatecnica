const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("desktopStorage", {
  getItem: (key) => ipcRenderer.sendSync("desktop-storage-get", String(key)),
  setItem: (key, value) => ipcRenderer.sendSync("desktop-storage-set", String(key), String(value)),
  removeItem: (key) => ipcRenderer.sendSync("desktop-storage-remove", String(key)),
  clear: () => ipcRenderer.sendSync("desktop-storage-clear")
});
