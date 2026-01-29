'use client'

import { useDispatch } from 'react-redux'
import { setView } from '../store/slices/viewSlice'
import GallerySection from './gallery/GallerySection'

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

      <section className="px-8 py-8 bg-gray-50">
        <GallerySection />
      </section>
    </div>
  )
}
