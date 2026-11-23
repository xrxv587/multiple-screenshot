const { BrowserWindow, Menu, clipboard, ClipboardItem } = require("electron");
const path = require("node:path");
const { Image } = require("node-screenshots");

/**
 * key id
 * value 
 * {
 *    window  instance
 *    image   instance  
 * }
 */

class PreviewWindowManager {
  manager = new Map();

  createPreview(image) {
    if (image instanceof Image) {
      const uniqId = Date.now() + "";
      const menu = Menu.buildFromTemplate([
        {
          label: "复制                      ",
          click:() => {
            // 放入剪切板
            console.log("已复制", uniqId);
            const img = this.getImage(uniqId);
            clipboard.write([
              new ClipboardItem({
                "image/png": img
              }),
            ]);
          }
        }
      ]);
      const preview = new BrowserWindow({
        name: uniqId,
        width: image.width,
        height: image.height,
        minWidth: image.width,
        minHeight: image.height,
        webPreferences: {
          preload: path.join(__dirname, "./previewPreload.js")
        }
      });
      preview.removeMenu();
      
      preview.webContents.on("context-menu", (_event, params) => {
          menu.popup();
      });
      preview.on("close", (e) => {
        this.closeWindow(uniqId);
      });

      preview.loadFile("./preview.html", {
        query: { id: uniqId }
      });

      this.manager.set(uniqId, {
        window: preview,
        image: image.toPngSync(),
      });
    }
  }

  getImage(id) {
    const img = this.manager.get(id)?.image;
    console.log(this.manager)
    if (img instanceof Buffer) {
      return img;
    }
    throw new Error("no shot found");
  }

  closeWindow(id) {
    this.manager.delete(id);
  }
}

const previewManager = new PreviewWindowManager();

module.exports = previewManager;