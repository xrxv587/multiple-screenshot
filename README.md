# multiple-screenshot

一个基于 **Electron** 的桌面截图工具：按下全局快捷键即可框选屏幕区域，截图结果自动复制到剪贴板，并弹出独立的预览窗口，方便连续截取多张图片。

## 功能

- 全局快捷键唤起全屏截图遮罩
- 鼠标拖拽框选截图区域，可拖动调整选区位置
- 双击选区完成截图，`Esc` 取消
- 截图自动写入系统剪贴板，并以独立窗口预览
- 预览窗口支持右键菜单复制图片
- 系统托盘常驻

## 使用

| 操作 | 说明 |
| --- | --- |
| `Ctrl + Alt + Q` / `Cmd + Alt + Q` | 开始截图 |
| 按住左键拖拽 | 框选区域 |
| 双击选区 | 完成截图 |
| `Esc` | 取消截图 |
| 预览窗口内右键 | 复制截图到剪贴板 |

## 开发

```bash
# 安装依赖
npm install

# 启动（nodemon + electron，热重载）
npm start
```

## 技术栈

- [Electron](https://www.electronjs.org/)
- [node-screenshots](https://www.npmjs.com/package/node-screenshots) —— 屏幕捕获与裁剪

## 已知限制

- 目前仅支持单屏幕截图（见 `main.js` / `screenshots.js` 中的 `FIXME`）
- 截图坐标缩放在高 DPI 缩放下可能存在偏差

## License

ISC
