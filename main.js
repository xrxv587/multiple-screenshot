const { 
  app, BrowserWindow, nativeImage, Menu, Tray, 
  globalShortcut, ipcMain, clipboard, ClipboardItem 
} = require("electron");
const path = require("node:path");
const { screenShot } = require("./screenshots");
const previewManager = require("./previewManager");
const { Image } = require("node-screenshots");

let mainWindow = null;
let screenImage = null;

const createWindow = () => {
  const win = new BrowserWindow({
    transparent: true,
    frame: false,
    movable: false,
    resizable: false,
    fullscreen: true,
    skipTaskbar: true,
    // show: false,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js")
    }
  });
  win.loadFile("index.html");
  win.webContents.on("before-input-event", (e, input) => {
    if (input.key === "Escape" && BrowserWindow.getAllWindows().length > 0) {
      // 关闭截图窗口
      mainWindow.close();
    }
  });
  return win;
}

const createTray = () => {
  // 托盘图标，建议 16x16 / 32x32 png，透明底
  const icon = nativeImage.createFromPath(app.getPath("exe"))
  const tray = new Tray(icon)
  tray.setToolTip('我的应用')

  const menu = Menu.buildFromTemplate([
    { label: '设置', click: () => {
      // TODO 打开设置窗口
    }},
    { type: 'separator' },
    { label: '退出', click: () => app.quit() }
  ])
  tray.setContextMenu(menu)
}

app.on("ready", () => {
  createTray();
  /**
   * 注册全局快捷键，按下快捷键调用截图输出到窗口预览
   * 确认截图后将窗口预览的选取坐标信息回传进行截图并输出到剪切板中
   */
  globalShortcut.register("CommandOrControl+Alt+Q", () => {
    // FIXME 暂时只支持一个屏幕
    screenImage = screenShot();
    // 创建窗口
    mainWindow = createWindow();
  });

  ipcMain.handle("screen:before", () => {
    return screenImage.toPngSync();
  });
  ipcMain.handle("screen:done", (e, imageRect) => {
    if (screenImage instanceof Image) {
      const { x, y, width, height } = imageRect;
      const imgInstance = screenImage.cropSync(x, y, width, height);
      const img = nativeImage.createFromBuffer(imgInstance.toPngSync()).toPNG();
      clipboard.write([
        new ClipboardItem({
          "image/png": img
        })
      ]);
      mainWindow.close();
      previewManager.createPreview(imgInstance);
    } else {
      throw new Error("screenImage is not instance of Image");
    }
  });
  ipcMain.handle("preview:getImage", (e, id) => {
    return previewManager.getImage(id);
  })

});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createWindow();
  }
});

app.on("window-all-closed", (e) => {
  // 关闭最后一个窗口后保持应用存活
  e.preventDefault();
  return;
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
