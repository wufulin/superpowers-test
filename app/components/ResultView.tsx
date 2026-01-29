'use client'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { setView } from '../store/slices/viewSlice'
import { clearImages } from '../store/slices/imageSlice'
import { addGalleryItem } from '../store/slices/gallerySlice'
import { useEffect, useState } from 'react'
import Header from './Header'
import { FrameStyle } from '../store/slices/frameSlice'

// 相框样式定义
const frameStyles: Record<FrameStyle, { className: string }> = {
  'black-marble': {
    className: 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900'
  },
  'spring-flower': {
    className: 'bg-gradient-to-br from-pink-100 via-green-50 to-pink-200'
  },
  'neon-party': {
    className: 'bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500'
  },
  'pink-dot': {
    className: 'bg-pink-100'
  },
  'pizza': {
    className: 'bg-gradient-to-br from-yellow-100 via-orange-100 to-yellow-200'
  },
  'starry-purple': {
    className: 'bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-950'
  }
}

export default function ResultView() {
  const dispatch = useDispatch()
  const { processedImage } = useSelector((state: RootState) => state.image)
  const { selectedFrame } = useSelector((state: RootState) => state.frame)
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
      fullImage: processedImage,
      frame: selectedFrame
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
      <Header backView="preview" />

      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="mb-8 animate-fade-in">
          <div className={`p-4 rounded-lg shadow-2xl ${frameStyles[selectedFrame].className}`}>
            <img
              src={processedImage}
              alt="Result"
              className="max-w-full max-h-80 object-contain"
            />
          </div>
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
