import { FrameStyle } from '../store/slices/frameSlice'

interface ProcessParams {
  retroIntensity: number
  filmTexture: number
  frameStyle: FrameStyle
}

export function processPolaroid(
  sourceImage: HTMLImageElement,
  params: ProcessParams
): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  // 宝丽来边框尺寸
  const imgWidth = sourceImage.naturalWidth
  const imgHeight = sourceImage.naturalHeight
  const borderTop = Math.max(10, Math.floor(imgWidth * 0.03))
  const borderSide = Math.max(15, Math.floor(imgWidth * 0.045))
  const borderBottom = Math.max(40, Math.floor(imgWidth * 0.12))

  canvas.width = imgWidth + borderSide * 2
  canvas.height = imgHeight + borderTop + borderBottom

  // 1. 绘制白色背景
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 2. 绘制原图
  ctx.drawImage(sourceImage, borderSide, borderTop, imgWidth, imgHeight)

  // 3. 获取图像数据进行处理
  const imageData = ctx.getImageData(borderSide, borderTop, imgWidth, imgHeight)
  const data = imageData.data

  // 复古色调调整
  const retroFactor = params.retroIntensity / 100
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i]
    let g = data[i + 1]
    let b = data[i + 2]

    // 降低饱和度
    const gray = r * 0.299 + g * 0.587 + b * 0.114
    r = r * (1 - retroFactor * 0.3) + gray * (retroFactor * 0.3)
    g = g * (1 - retroFactor * 0.2) + gray * (retroFactor * 0.2)
    b = b * (1 - retroFactor * 0.1) + gray * (retroFactor * 0.1)

    // 增加暖色调
    r += retroFactor * 15
    g += retroFactor * 5
    b -= retroFactor * 10

    // 降低对比度
    r = r * (1 - retroFactor * 0.1) + 128 * (retroFactor * 0.1)
    g = g * (1 - retroFactor * 0.1) + 128 * (retroFactor * 0.1)
    b = b * (1 - retroFactor * 0.1) + 128 * (retroFactor * 0.1)

    data[i] = Math.max(0, Math.min(255, r))
    data[i + 1] = Math.max(0, Math.min(255, g))
    data[i + 2] = Math.max(0, Math.min(255, b))
  }

  ctx.putImageData(imageData, borderSide, borderTop)

  // 4. 胶片质感（噪点）
  if (params.filmTexture > 0) {
    const textureCanvas = document.createElement('canvas')
    textureCanvas.width = imgWidth
    textureCanvas.height = imgHeight
    const textureCtx = textureCanvas.getContext('2d')!

    const imageData = textureCtx.createImageData(imgWidth, imgHeight)
    const data = imageData.data
    const noiseIntensity = params.filmTexture / 100 * 30

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * noiseIntensity
      data[i] = 128 + noise
      data[i + 1] = 128 + noise
      data[i + 2] = 128 + noise
      data[i + 3] = 15 // 低透明度
    }

    textureCtx.putImageData(imageData, 0, 0)
    ctx.drawImage(textureCanvas, borderSide, borderTop)
  }

  // 5. 绘制相框（简化版 - 彩色边框）
  drawFrame(ctx, canvas.width, canvas.height, params.frameStyle)

  return canvas.toDataURL('image/jpeg', 0.9)
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frameStyle: FrameStyle
) {
  const frameColors: Record<FrameStyle, string> = {
    'black-marble': '#2a2a2a',
    'spring-flower': '#f8e8e8',
    'neon-party': 'linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0)',
    'pink-dot': '#ffe4ec',
    'pizza': '#ffd89b',
    'starry-purple': '#e6e6fa'
  }

  const color = frameColors[frameStyle]

  // 绘制边框装饰
  ctx.save()
  ctx.strokeStyle = color.startsWith('linear') ? '#ff0080' : color
  ctx.lineWidth = 4

  // 顶部装饰条
  ctx.beginPath()
  ctx.moveTo(10, 5)
  ctx.lineTo(width - 10, 5)
  ctx.stroke()

  // 底部装饰条
  ctx.beginPath()
  ctx.moveTo(10, height - 5)
  ctx.lineTo(width - 10, height - 5)
  ctx.stroke()

  ctx.restore()
}
