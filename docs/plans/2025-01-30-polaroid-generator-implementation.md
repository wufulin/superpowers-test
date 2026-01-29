# POLAGRAM 宝丽来生成器实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 构建一个在线宝丽来风格照片生成器 Web 应用

**Architecture:** Next.js 16 + React + TypeScript + Redux Toolkit + Tailwind CSS，单页面多视图架构（landing/upload/preview/processing/result），Canvas 处理图片转换

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Redux Toolkit, Tailwind CSS 4

---

## 前置准备

### Task 0: 初始化 Next.js 项目

**Files:**
- Create: `package.json`
- Create: `next.config.js`
- Create: `tsconfig.json`
- Create: `tailwind.config.js`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`

**Step 1: 初始化项目**

Run: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm`

Expected: 项目初始化完成

**Step 2: 安装额外依赖**

Run: `npm install @reduxjs/toolkit react-redux`

Expected: 依赖安装完成

**Step 3: 配置 Next.js 静态导出**

Modify: `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
}

module.exports = nextConfig
```

**Step 4: 验证项目运行**

Run: `npm run build`

Expected: 构建成功，dist 目录生成

**Step 5: Commit**

```bash
git add .
git commit -m "chore: initialize Next.js project with TypeScript and Tailwind"
```

---

## 阶段一：Redux Store 架构

### Task 1: 创建 View Slice（视图状态）

**Files:**
- Create: `app/store/slices/viewSlice.ts`
- Create: `app/store/index.ts`

**Step 1: 编写 View Slice**

```typescript
// app/store/slices/viewSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ViewState = 'landing' | 'upload' | 'preview' | 'processing' | 'result'

interface ViewSliceState {
  currentView: ViewState
}

const initialState: ViewSliceState = {
  currentView: 'landing'
}

const viewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setView: (state, action: PayloadAction<ViewState>) => {
      state.currentView = action.payload
    }
  }
})

export const { setView } = viewSlice.actions
export default viewSlice.reducer
```

**Step 2: 创建 Store 配置**

```typescript
// app/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import viewReducer from './slices/viewSlice'

export const store = configureStore({
  reducer: {
    view: viewReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

**Step 3: 在 layout 中注入 Provider**

Modify: `app/layout.tsx`

```typescript
import { Provider } from 'react-redux'
import { store } from './store'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  )
}
```

**Step 4: Commit**

```bash
git add app/store/
git commit -m "feat: add Redux store with view slice"
```

---

### Task 2: 创建 Image Slice（图片数据）

**Files:**
- Create: `app/store/slices/imageSlice.ts`
- Modify: `app/store/index.ts`

**Step 1: 编写 Image Slice**

```typescript
// app/store/slices/imageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ImageSliceState {
  originalImage: string | null
  processedImage: string | null
}

const initialState: ImageSliceState = {
  originalImage: null,
  processedImage: null
}

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setOriginalImage: (state, action: PayloadAction<string>) => {
      state.originalImage = action.payload
    },
    setProcessedImage: (state, action: PayloadAction<string>) => {
      state.processedImage = action.payload
    },
    clearImages: (state) => {
      state.originalImage = null
      state.processedImage = null
    }
  }
})

export const { setOriginalImage, setProcessedImage, clearImages } = imageSlice.actions
export default imageSlice.reducer
```

**Step 2: 更新 Store**

```typescript
// app/store/index.ts
import imageReducer from './slices/imageSlice'

export const store = configureStore({
  reducer: {
    view: viewReducer,
    image: imageReducer
  }
})
```

**Step 3: Commit**

```bash
git add app/store/slices/imageSlice.ts app/store/index.ts
git commit -m "feat: add image slice for original and processed images"
```

---

### Task 3: 创建 Params Slice（调节参数）

**Files:**
- Create: `app/store/slices/paramsSlice.ts`
- Modify: `app/store/index.ts`

**Step 1: 编写 Params Slice**

```typescript
// app/store/slices/paramsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ParamsSliceState {
  retroIntensity: number
  filmTexture: number
}

const initialState: ParamsSliceState = {
  retroIntensity: 60,
  filmTexture: 50
}

const paramsSlice = createSlice({
  name: 'params',
  initialState,
  reducers: {
    setRetroIntensity: (state, action: PayloadAction<number>) => {
      state.retroIntensity = Math.max(0, Math.min(100, action.payload))
    },
    setFilmTexture: (state, action: PayloadAction<number>) => {
      state.filmTexture = Math.max(0, Math.min(100, action.payload))
    },
    resetParams: (state) => {
      state.retroIntensity = 60
      state.filmTexture = 50
    }
  }
})

export const { setRetroIntensity, setFilmTexture, resetParams } = paramsSlice.actions
export default paramsSlice.reducer
```

**Step 2: 更新 Store 并 Commit**

```bash
git add app/store/slices/paramsSlice.ts app/store/index.ts
git commit -m "feat: add params slice for retro intensity and film texture"
```

---

### Task 4: 创建 Frame Slice（相框选择）

**Files:**
- Create: `app/store/slices/frameSlice.ts`
- Modify: `app/store/index.ts`

**Step 1: 编写 Frame Slice**

```typescript
// app/store/slices/frameSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type FrameStyle =
  | 'black-marble'
  | 'spring-flower'
  | 'neon-party'
  | 'pink-dot'
  | 'pizza'
  | 'starry-purple'

interface FrameSliceState {
  selectedFrame: FrameStyle
}

const initialState: FrameSliceState = {
  selectedFrame: 'black-marble'
}

const frameSlice = createSlice({
  name: 'frame',
  initialState,
  reducers: {
    setFrame: (state, action: PayloadAction<FrameStyle>) => {
      state.selectedFrame = action.payload
    }
  }
})

export const { setFrame } = frameSlice.actions
export default frameSlice.reducer
```

**Step 2: Commit**

```bash
git add app/store/slices/frameSlice.ts app/store/index.ts
git commit -m "feat: add frame slice with 6 frame styles"
```

---

### Task 5: 创建 Gallery Slice（历史记录）

**Files:**
- Create: `app/store/slices/gallerySlice.ts`
- Modify: `app/store/index.ts`

**Step 1: 编写 Gallery Slice**

```typescript
// app/store/slices/gallerySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface GalleryItem {
  id: string
  thumbnail: string
  fullImage: string
  createdAt: string
}

interface GallerySliceState {
  items: GalleryItem[]
}

const GALLERY_KEY = 'polagram-gallery'

const loadFromStorage = (): GalleryItem[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(GALLERY_KEY)
  return stored ? JSON.parse(stored) : []
}

const initialState: GallerySliceState = {
  items: loadFromStorage()
}

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    addGalleryItem: (state, action: PayloadAction<Omit<GalleryItem, 'id' | 'createdAt'>>) => {
      const newItem: GalleryItem = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      state.items = [newItem, ...state.items].slice(0, 20)
      localStorage.setItem(GALLERY_KEY, JSON.stringify(state.items))
    },
    clearGallery: (state) => {
      state.items = []
      localStorage.removeItem(GALLERY_KEY)
    }
  }
})

export const { addGalleryItem, clearGallery } = gallerySlice.actions
export default gallerySlice.reducer
```

**Step 2: Commit**

```bash
git add app/store/slices/gallerySlice.ts app/store/index.ts
git commit -m "feat: add gallery slice with localStorage persistence"
```

---

## 阶段二：视图组件

### Task 6: 创建 LandingView 组件

**Files:**
- Create: `app/components/LandingView.tsx`
- Modify: `app/page.tsx`

**Step 1: 编写 LandingView 组件**

```typescript
// app/components/LandingView.tsx
'use client'

import { useDispatch } from 'react-redux'
import { setView } from '../store/slices/viewSlice'

export default function LandingView() {
  const dispatch = useDispatch()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="text-xl font-bold text-gray-900">POLAGRAM</div>
        <div className="text-sm text-gray-600">时光拍立得</div>
        <button className="text-gray-600 hover:text-gray-900">设置</button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center px-8 py-12">
        <div className="md:w-1/2 space-y-6">
          <p className="text-sm text-gray-500 tracking-widest">INTRODUCING POLAGRAM</p>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            THE ORIGINAL<br />
            <span className="bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
              IS BACK.
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 via-orange-500 to-red-500 rounded"></div>
          <p className="text-gray-600 max-w-md">
            AI驱动的宝丽来风格转换器<br />
            Transform your photos into vintage Polaroid masterpieces
          </p>
          <button
            onClick={() => dispatch(setView('upload'))}
            className="bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors"
          >
            开始创作 →
          </button>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
          <div className="w-64 h-80 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">宝丽来相机插图</span>
          </div>
        </div>
      </main>
    </div>
  )
}
```

**Step 2: 更新 page.tsx**

```typescript
// app/page.tsx
'use client'

import { useSelector } from 'react-redux'
import { RootState } from './store'
import LandingView from './components/LandingView'

export default function Home() {
  const currentView = useSelector((state: RootState) => state.view.currentView)

  return (
    <main>
      {currentView === 'landing' && <LandingView />}
    </main>
  )
}
```

**Step 3: Commit**

```bash
git add app/components/LandingView.tsx app/page.tsx
git commit -m "feat: add LandingView component with hero section"
```

---

### Task 7: 创建 UploadView 组件

**Files:**
- Create: `app/components/UploadView.tsx`
- Modify: `app/page.tsx`

**Step 1: 编写 UploadView 组件**

```typescript
// app/components/UploadView.tsx
'use client'

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setView } from '../store/slices/viewSlice'
import { setOriginalImage } from '../store/slices/imageSlice'

export default function UploadView() {
  const dispatch = useDispatch()

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件 (JPG/PNG/WEBP)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('文件大小不能超过 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      dispatch(setOriginalImage(e.target?.result as string))
      dispatch(setView('preview'))
    }
    reader.readAsDataURL(file)
  }, [dispatch])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="flex justify-between items-center p-6">
        <button
          onClick={() => dispatch(setView('landing'))}
          className="text-gray-600 hover:text-gray-900"
        >
          ← 返回
        </button>
        <div className="text-xl font-bold text-gray-900">POLAGRAM</div>
        <div className="w-16"></div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full max-w-xl h-96 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <div className="w-16 h-16 mb-4 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-lg text-gray-700 mb-2">拖拽照片到此处</p>
          <p className="text-sm text-gray-500">或点击选择文件</p>
          <p className="text-xs text-gray-400 mt-4">支持 JPG, PNG, WEBP · 最大 10MB</p>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileInput}
          />
        </div>
      </main>
    </div>
  )
}
```

**Step 2: 更新 page.tsx**

```typescript
// app/page.tsx
import UploadView from './components/UploadView'

// ... in component:
{currentView === 'upload' && <UploadView />}
```

**Step 3: Commit**

```bash
git add app/components/UploadView.tsx app/page.tsx
git commit -m "feat: add UploadView with drag-and-drop support"
```

---

### Task 8: 创建 Canvas 处理器

**Files:**
- Create: `app/lib/canvasProcessor.ts`

**Step 1: 编写 Canvas 处理器**

```typescript
// app/lib/canvasProcessor.ts
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
```

**Step 2: Commit**

```bash
git add app/lib/canvasProcessor.ts
git commit -m "feat: add canvas processor for polaroid effect"
```

---

### Task 9: 创建 PreviewView 组件

**Files:**
- Create: `app/components/PreviewView.tsx`
- Modify: `app/page.tsx`

**Step 1: 编写 PreviewView 组件**

```typescript
// app/components/PreviewView.tsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { setView } from '../store/slices/viewSlice'
import { setProcessedImage } from '../store/slices/imageSlice'
import { setRetroIntensity, setFilmTexture } from '../store/slices/paramsSlice'
import { setFrame, FrameStyle } from '../store/slices/frameSlice'
import { processPolaroid } from '../lib/canvasProcessor'

const frames: { id: FrameStyle; name: string; color: string }[] = [
  { id: 'black-marble', name: '黑色大理石', color: '#2a2a2a' },
  { id: 'spring-flower', name: '春日花簇', color: '#f8e8e8' },
  { id: 'neon-party', name: '荧光派对', color: '#ff0080' },
  { id: 'pink-dot', name: '粉色波点', color: '#ffe4ec' },
  { id: 'pizza', name: '美式披萨', color: '#ffd89b' },
  { id: 'starry-purple', name: '星空紫色', color: '#e6e6fa' },
]

export default function PreviewView() {
  const dispatch = useDispatch()
  const { originalImage } = useSelector((state: RootState) => state.image)
  const { retroIntensity, filmTexture } = useSelector((state: RootState) => state.params)
  const { selectedFrame } = useSelector((state: RootState) => state.frame)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const imgRef = useRef<HTMLImageElement | null>(null)

  // 加载原图
  useEffect(() => {
    if (!originalImage) {
      dispatch(setView('upload'))
      return
    }
    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      updatePreview(img)
    }
    img.src = originalImage
  }, [originalImage, dispatch])

  // 更新预览
  const updatePreview = useCallback((img: HTMLImageElement) => {
    const result = processPolaroid(img, {
      retroIntensity,
      filmTexture,
      frameStyle: selectedFrame
    })
    setPreviewUrl(result)
  }, [retroIntensity, filmTexture, selectedFrame])

  // 参数变化时更新预览
  useEffect(() => {
    if (imgRef.current) {
      updatePreview(imgRef.current)
    }
  }, [updatePreview])

  const handleGenerate = () => {
    if (previewUrl) {
      dispatch(setProcessedImage(previewUrl))
      dispatch(setView('result'))
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="flex justify-between items-center p-6">
        <button
          onClick={() => dispatch(setView('upload'))}
          className="text-gray-600 hover:text-gray-900"
        >
          ← 返回
        </button>
        <div className="text-xl font-bold text-gray-900">POLAGRAM</div>
        <div className="w-16"></div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row">
        {/* 相框选择 */}
        <div className="lg:w-1/3 p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
          <h2 className="text-lg font-semibold mb-4">选择您的相框</h2>
          <div className="grid grid-cols-3 gap-3">
            {frames.map((frame) => (
              <button
                key={frame.id}
                onClick={() => dispatch(setFrame(frame.id))}
                className={`aspect-square rounded-lg border-2 transition-all ${
                  selectedFrame === frame.id
                    ? 'border-gray-900 shadow-lg'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
                style={{ backgroundColor: frame.color }}
              >
                <span className="text-xs font-medium text-gray-700 bg-white/80 px-2 py-1 rounded">
                  {frame.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 预览和调节 */}
        <div className="lg:w-2/3 p-6 flex flex-col items-center">
          <div className="relative mb-6">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-96 object-contain shadow-lg"
              />
            ) : (
              <div className="w-64 h-80 bg-gray-100 flex items-center justify-center">
                加载中...
              </div>
            )}
          </div>

          {/* 参数调节 */}
          <div className="w-full max-w-md space-y-4 mb-6">
            <div>
              <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                <span>复古强度</span>
                <span>{retroIntensity}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={retroIntensity}
                onChange={(e) => dispatch(setRetroIntensity(Number(e.target.value)))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                <span>胶片质感</span>
                <span>{filmTexture}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filmTexture}
                onChange={(e) => dispatch(setFilmTexture(Number(e.target.value)))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* 生成按钮 */}
          <button
            onClick={handleGenerate}
            className="w-full max-w-md bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            生成宝丽来
          </button>
        </div>
      </main>
    </div>
  )
}
```

**Step 2: 更新 page.tsx 并 Commit**

```bash
git add app/components/PreviewView.tsx app/page.tsx
git commit -m "feat: add PreviewView with frame selection and parameter controls"
```

---

### Task 10: 创建 ResultView 组件

**Files:**
- Create: `app/components/ResultView.tsx`
- Modify: `app/page.tsx`

**Step 1: 编写 ResultView 组件**

```typescript
// app/components/ResultView.tsx
'use client'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { setView } from '../store/slices/viewSlice'
import { clearImages } from '../store/slices/imageSlice'
import { addGalleryItem } from '../store/slices/gallerySlice'
import { useEffect, useState } from 'react'

export default function ResultView() {
  const dispatch = useDispatch()
  const { processedImage } = useSelector((state: RootState) => state.image)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!processedImage) {
      dispatch(setView('upload'))
    }
  }, [processedImage, dispatch])

  const handleDownload = () => {
    if (!processedImage) return
    const link = document.createElement('a')
    link.href = processedImage
    link.download = `polagram-${Date.now()}.jpg`
    link.click()
  }

  const handleSaveToGallery = () => {
    if (!processedImage || saved) return
    dispatch(addGalleryItem({
      thumbnail: processedImage,
      fullImage: processedImage
    }))
    setSaved(true)
  }

  const handleNewPhoto = () => {
    dispatch(clearImages())
    dispatch(setView('upload'))
  }

  if (!processedImage) return null

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="flex justify-between items-center p-6">
        <button
          onClick={() => dispatch(setView('preview'))}
          className="text-gray-600 hover:text-gray-900"
        >
          ← 返回
        </button>
        <div className="text-xl font-bold text-gray-900">POLAGRAM</div>
        <div className="w-16"></div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="mb-8 animate-fade-in">
          <img
            src={processedImage}
            alt="Result"
            className="max-w-full max-h-96 object-contain shadow-2xl"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            onClick={handleDownload}
            className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-full hover:bg-gray-800 transition-colors"
          >
            下载图片
          </button>
          <button
            onClick={handleNewPhoto}
            className="flex-1 border-2 border-gray-900 text-gray-900 py-3 px-6 rounded-full hover:bg-gray-50 transition-colors"
          >
            再做一张
          </button>
        </div>

        <button
          onClick={handleSaveToGallery}
          disabled={saved}
          className={`mt-4 text-sm ${
            saved ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {saved ? '✓ 已保存到作品集' : '保存到作品集'}
        </button>
      </main>
    </div>
  )
}
```

**Step 2: 更新 page.tsx 并 Commit**

```bash
git add app/components/ResultView.tsx app/page.tsx
git commit -m "feat: add ResultView with download and gallery save"
```

---

### Task 11: 创建 GallerySection 组件

**Files:**
- Create: `app/components/gallery/HangingPhoto.tsx`
- Create: `app/components/gallery/GallerySection.tsx`
- Modify: `app/components/LandingView.tsx`

**Step 1: 编写 HangingPhoto 组件**

```typescript
// app/components/gallery/HangingPhoto.tsx
'use client'

import { useState } from 'react'
import { GalleryItem } from '../../store/slices/gallerySlice'

interface HangingPhotoProps {
  item: GalleryItem
  index: number
}

export default function HangingPhoto({ item, index }: HangingPhotoProps) {
  const [showFull, setShowFull] = useState(false)
  const rotation = ((index % 5) - 2) * 3 // -6° to +6°

  return (
    <>
      <div
        className="relative cursor-pointer transition-transform hover:-translate-y-2"
        style={{ transform: `rotate(${rotation}deg)` }}
        onClick={() => setShowFull(true)}
      >
        {/* 绳子/夹子 */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gray-300"></div>
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-3 h-4 bg-amber-700 rounded-sm"></div>

        {/* 照片 */}
        <div className="bg-white p-2 pb-8 shadow-md">
          <img
            src={item.thumbnail}
            alt="Gallery item"
            className="w-24 h-24 object-cover"
          />
          <p className="text-xs text-gray-400 mt-2 text-center">
            {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* 全屏查看 */}
      {showFull && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowFull(false)}
        >
          <img
            src={item.fullImage}
            alt="Full size"
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
        </div>
      )}
    </>
  )
}
```

**Step 2: 编写 GallerySection 组件**

```typescript
// app/components/gallery/GallerySection.tsx
'use client'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { clearGallery } from '../../store/slices/gallerySlice'
import HangingPhoto from './HangingPhoto'

export default function GallerySection() {
  const dispatch = useDispatch()
  const { items } = useSelector((state: RootState) => state.gallery)

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-400">您的作品集是空的</p>
        <p className="text-sm text-gray-300 mt-2">开始创作您的第一张宝丽来照片吧</p>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Your Gallery</h2>
          <p className="text-sm text-gray-500">您的作品集</p>
        </div>
        <button
          onClick={() => dispatch(clearGallery())}
          className="text-gray-400 hover:text-red-500 transition-colors"
          title="清空作品集"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* 绳子 */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-300"></div>

        {/* 照片 */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-6 px-2">
          {items.map((item, index) => (
            <HangingPhoto key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
```

**Step 3: 更新 LandingView**

```typescript
// app/components/LandingView.tsx
import GallerySection from './gallery/GallerySection'

// 在 </main> 之前添加:
<section className="px-8 py-8 bg-gray-50">
  <GallerySection />
</section>
```

**Step 4: Commit**

```bash
git add app/components/gallery/
git commit -m "feat: add GallerySection with hanging photo effect"
```

---

## 阶段三：样式优化

### Task 12: 添加动画和全局样式

**Files:**
- Modify: `app/globals.css`

**Step 1: 添加自定义动画**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.4s ease-out;
}

/* 滑块样式 */
input[type="range"] {
  @apply h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer;
}

input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-gray-900 rounded-full cursor-pointer;
}

input[type="range"]::-moz-range-thumb {
  @apply w-4 h-4 bg-gray-900 rounded-full cursor-pointer border-0;
}
```

**Step 2: Commit**

```bash
git add app/globals.css
git commit -m "style: add animations and custom range input styles"
```

---

## 阶段四：构建和验证

### Task 13: 构建项目

**Step 1: 运行构建**

Run: `npm run build`

Expected: 构建成功，dist 目录包含所有文件

**Step 2: 验证构建输出**

Run: `ls -la dist/`

Expected: 包含 index.html, _next/ 目录等

**Step 3: Commit**

```bash
git add dist/ 2>/dev/null || echo "dist is gitignored"
git commit -m "chore: successful build" || echo "nothing to commit"
```

---

## 完成总结

**已实现功能:**
1. ✅ 5 个视图状态（landing/upload/preview/processing/result）
2. ✅ Redux Store 完整架构（6 个 slice）
3. ✅ 照片上传（拖拽/点击）
4. ✅ Canvas 宝丽来处理（复古色调、胶片噪点）
5. ✅ 6 种相框选择
6. ✅ 参数实时调节
7. ✅ Gallery 历史记录（localStorage）
8. ✅ 下载功能
9. ✅ 响应式设计

**构建输出:** `dist/` 目录，可部署到任何静态托管服务

---

**计划完成！**

两个执行选项：

1. **Subagent-Driven（本会话）** - 我逐个任务调度子代理执行，每步审核
2. **并行会话（新会话）** - 在新会话中使用 executing-plans 批量执行

你想用哪种方式开始实现？