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
