const { Monitor } = require("node-screenshots");

// 传入鼠标screenX,screenY坐标获取监视器
const getMonitor = (x = 0, y = 0) => {
  const monitor = Monitor.all();
  
}

// 截图
const screenShot = () => {
    // const {x, y, width, height } = mainWindow.getBounds();
    const monitor = Monitor.fromPoint(0, 0);
    const image = monitor.captureImageSync();
    return image;
}

module.exports = {
  screenShot
}