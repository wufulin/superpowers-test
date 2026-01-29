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
