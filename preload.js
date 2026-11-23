const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke("ping"),
  screenShot: () => ipcRenderer.invoke("screen:before"),
  cropImage: (imageRect) => ipcRenderer.invoke("screen:done", imageRect)
  // onScreenShot: 
})

// contextBridge.exposeInMainWorld("win", {
//   displayWindow: () => ipcRenderer.invoke("window:display"),
//   hideWindow: () => ipcRenderer.invoke("window:hide"),
// })