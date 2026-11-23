const func = async () => {
  const response = await api.ping();
  console.log(response);
}

const overlay = document.getElementById('overlay')
const selection = document.getElementById('selection')
const img = document.getElementById('screen')

api.screenShot().then(rawBuffer => {
  const blob = new Blob([rawBuffer], { type: 'image/png' })
  const url = URL.createObjectURL(blob)
  img.src = url;
})



let rect = { x: 0, y: 0, width: 0, height: 0 }
let mode = null // 'create' | 'move'
let startX = 0, startY = 0
let startRect = null

const W = () => window.innerWidth
const H = () => window.innerHeight

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

function applyRect() {
  selection.style.left = rect.x + 'px'
  selection.style.top = rect.y + 'px'
  selection.style.width = rect.width + 'px'
  selection.style.height = rect.height + 'px'
}

function normalizeRect(r) {
  return {
    x: Math.min(r.x, r.x + r.width),
    y: Math.min(r.y, r.y + r.height),
    width: Math.abs(r.width),
    height: Math.abs(r.height)
  }
}

/* 新建选区 */
overlay.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return
  mode = 'create'
  startX = clamp(e.clientX, 0, W())
  startY = clamp(e.clientY, 0, H())
  rect = { x: startX, y: startY, width: 0, height: 0 }
  selection.style.display = 'block'
  applyRect()
})

/* 移动选区 */
selection.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return
  e.stopPropagation()
  mode = 'move'
  startX = e.clientX
  startY = e.clientY
  startRect = { ...rect }
})

window.addEventListener('mousemove', (e) => {
  if (!mode) return

  if (mode === 'create') {
    const cx = clamp(e.clientX, 0, W())
    const cy = clamp(e.clientY, 0, H())
    rect = normalizeRect({
      x: startX,
      y: startY,
      width: cx - startX,
      height: cy - startY
    })
  } else if (mode === 'move') {
    const dx = e.clientX - startX
    const dy = e.clientY - startY

    // 移动时保持选区尺寸不变，限制左上角不越界
    rect = {
      x: clamp(startRect.x + dx, 0, W() - startRect.width),
      y: clamp(startRect.y + dy, 0, H() - startRect.height),
      width: startRect.width,
      height: startRect.height
    }
  }
  applyRect()
})

window.addEventListener('mouseup', () => {
  if (!mode) return

  if (rect.width < 1 || rect.height < 1) {
    selection.style.display = 'none'
  } 
  // else {
  //   outputRect()
  // }
  mode = null
})

function outputRect() {
  const winRect = {
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    width: Math.round(rect.width),
    height: Math.round(rect.height)
  }

  const scaleX = img.naturalWidth / window.innerWidth
  const scaleY = img.naturalHeight / window.innerHeight
  const imageRect = {
    x: Math.round(winRect.x * scaleX),
    y: Math.round(winRect.y * scaleY),
    width: Math.round(winRect.width * scaleX),
    height: Math.round(winRect.height * scaleY)
  }

  console.log('窗口坐标:', winRect)
  console.log('图片像素坐标:', imageRect)
  window.api.cropImage(imageRect)
}

selection.addEventListener("dblclick", outputRect);
