const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const storePath = () => path.join(app.getPath("userData"), "game-data.json");
function readStore() {
  try { return JSON.parse(fs.readFileSync(storePath(), "utf8")); }
  catch (_) { return {}; }
}
function writeStore(data) {
  const file = storePath();
  const temp = file + ".tmp";
  fs.writeFileSync(temp, JSON.stringify(data));
  fs.renameSync(temp, file);
}
ipcMain.on("desktop-storage-get", (event, key) => {
  const data = readStore();
  event.returnValue = Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
});
ipcMain.on("desktop-storage-set", (event, key, value) => {
  const data = readStore();
  data[key] = String(value);
  writeStore(data);
  event.returnValue = true;
});
ipcMain.on("desktop-storage-remove", (event, key) => {
  const data = readStore();
  delete data[key];
  writeStore(data);
  event.returnValue = true;
});
ipcMain.on("desktop-storage-clear", (event) => {
  writeStore({});
  event.returnValue = true;
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1440, height: 920, minWidth: 900, minHeight: 620,
    backgroundColor: "#17171d",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile(path.join(__dirname, "index.html"));
}
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
