// Small, safe bridge: lets the page ask the app for an exact screenshot of the window.
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('mpNative', {
  capture: () => ipcRenderer.invoke('mp-capture')
});
