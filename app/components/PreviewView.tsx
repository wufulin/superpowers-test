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
      <Header backView="upload" />

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
