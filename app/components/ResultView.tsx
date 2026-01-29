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
