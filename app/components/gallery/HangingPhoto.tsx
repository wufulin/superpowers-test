'use client'

import { useState } from 'react'
import { GalleryItem } from '../../store/slices/gallerySlice'
import { FrameStyle } from '../../store/slices/frameSlice'

interface HangingPhotoProps {
  item: GalleryItem
  index: number
}

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

export default function HangingPhoto({ item, index }: HangingPhotoProps) {
  const [showFull, setShowFull] = useState(false)
  const rotation = ((index % 5) - 2) * 3 // -6° to +6°
  const frame = item.frame || 'black-marble'

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

        {/* 照片 - 带相框 */}
        <div className={`p-1.5 pb-6 shadow-md ${frameStyles[frame].className}`}>
          <img
            src={item.thumbnail}
            alt="Gallery item"
            className="w-20 h-20 object-cover bg-white"
          />
          <p className="text-[10px] text-white/80 mt-1.5 text-center">
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
          <div className={`p-4 rounded-lg ${frameStyles[frame].className}`}>
            <img
              src={item.fullImage}
              alt="Full size"
              className="max-w-[80vw] max-h-[70vh] object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}
