const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('preview', {
  getImage: (id) => ipcRenderer.invoke("preview:getImage", id),
});
