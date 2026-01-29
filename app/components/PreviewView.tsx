'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { setView } from '../store/slices/viewSlice'
import { setProcessedImage } from '../store/slices/imageSlice'
import { setRetroIntensity, setFilmTexture } from '../store/slices/paramsSlice'
import { setFrame, FrameStyle } from '../store/slices/frameSlice'
import { processPolaroid } from '../lib/canvasProcessor'
import Header from './Header'

// 相框样式定义 - 根据 Image #2 设计
const frameStyles: Record<FrameStyle, { name: string; className: string }> = {
  'black-marble': {
    name: '黑色大理石',
    className: 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900'
  },
  'spring-flower': {
    name: '春日花簇',
    className: 'bg-gradient-to-br from-pink-100 via-green-50 to-pink-200'
  },
  'neon-party': {
    name: '荧光派对',
    className: 'bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500'
  },
  'pink-dot': {
    name: '粉色波点',
    className: 'bg-pink-100'
  },
  'pizza': {
    name: '美式披萨',
    className: 'bg-gradient-to-br from-yellow-100 via-orange-100 to-yellow-200'
  },
  'starry-purple': {
    name: '星空紫色',
    className: 'bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-950'
  }
}

const frameList: FrameStyle[] = ['black-marble', 'spring-flower', 'neon-party', 'pink-dot', 'pizza', 'starry-purple']

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
      <Header backView="upload" />

      <main className="flex-1 flex flex-col lg:flex-row">
        {/* 相框选择 */}
        <div className="lg:w-2/5 p-6 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Choose Your Frame</h2>
          <p className="text-sm text-gray-600 mb-1">选择您的相框</p>
          <p className="text-xs text-gray-400 mb-6">Select a Polaroid frame style</p>

          <div className="grid grid-cols-3 gap-4">
            {frameList.map((frameId) => {
              const frame = frameStyles[frameId]
              const isSelected = selectedFrame === frameId

              return (
                <button
                  key={frameId}
                  onClick={() => dispatch(setFrame(frameId))}
                  className={`aspect-square rounded-2xl overflow-hidden transition-all ${
                    isSelected
                      ? 'ring-4 ring-purple-400 shadow-xl scale-105'
                      : 'ring-2 ring-gray-200 hover:ring-gray-300'
                  }`}
                >
                  <div className={`w-full h-full ${frame.className} p-3 flex flex-col`}>
                    {/* 相框边框效果 */}
                    <div className="flex-1 bg-white rounded-sm shadow-inner flex items-center justify-center">
                      <div className="w-12 h-12 bg-gray-100 rounded"></div>
                    </div>

                    {/* 底部标签 */}
                    <div className="mt-2 py-1.5 bg-gradient-to-t from-black/60 to-transparent rounded-b">
                      <p className="text-xs font-medium text-white text-center">{frame.name}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 预览和调节 */}
        <div className="lg:w-3/5 p-6 flex flex-col items-center">
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
            className="w-full max-w-md h-14 bg-gradient-to-r from-pink-300 via-purple-300 via-blue-300 via-green-300 to-yellow-300 text-white font-semibold rounded-2xl hover:opacity-90 transition-opacity flex flex-col items-center justify-center shadow-lg"
          >
            <span className="text-base font-bold">Generate Polaroid</span>
            <span className="text-xs opacity-90">生成宝丽来</span>
          </button>
        </div>
      </main>
    </div>
  )
}
