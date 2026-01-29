'use client'

import { useDispatch } from 'react-redux'
import { setView } from '../store/slices/viewSlice'
import GallerySection from './gallery/GallerySection'

export default function LandingView() {
  const dispatch = useDispatch()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6">
        <div className="flex items-center gap-3">
          {/* Logo with rainbow bars */}
          <div className="flex gap-0.5">
            <div className="w-1 h-5 bg-blue-400 rounded-sm"></div>
            <div className="w-1 h-5 bg-green-400 rounded-sm"></div>
            <div className="w-1 h-5 bg-yellow-400 rounded-sm"></div>
            <div className="w-1 h-5 bg-orange-400 rounded-sm"></div>
            <div className="w-1 h-5 bg-red-400 rounded-sm"></div>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-wide">POLAGRAM</span>
          <span className="text-sm text-gray-500 ml-2">时光拍立得</span>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-8 lg:px-24 py-8 lg:py-0 gap-8 lg:gap-16">
        {/* Left Content */}
        <div className="lg:w-5/12 space-y-6">
          <p className="text-xs text-gray-400 tracking-[0.2em] uppercase">Introducing Polagram</p>

          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[0.95] tracking-tight">
            THE ORIGINAL<br />
            <span className="bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              IS BACK.
            </span>
          </h1>

          {/* Rainbow bars */}
          <div className="flex gap-1.5 pt-2">
            <div className="w-14 h-3 bg-blue-400 rounded-sm"></div>
            <div className="w-14 h-3 bg-green-400 rounded-sm"></div>
            <div className="w-14 h-3 bg-yellow-400 rounded-sm"></div>
            <div className="w-14 h-3 bg-orange-400 rounded-sm"></div>
            <div className="w-14 h-3 bg-red-400 rounded-sm"></div>
          </div>

          <div className="space-y-2 pt-4">
            <p className="text-gray-700 text-base">
              AI驱动的宝丽来风格照片生成器，让您的瞬间变成永恒的经典
            </p>
            <p className="text-gray-400 text-sm">
              Transform your photos into authentic Polaroid-style memories with AI
            </p>
          </div>

          <button
            onClick={() => dispatch(setView('upload'))}
            className="bg-gray-900 text-white px-10 py-4 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2 text-base font-medium mt-4"
          >
            开始创作
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Right Content - Camera Image */}
        <div className="lg:w-5/12 mt-12 lg:mt-0 flex justify-center">
          <div className="relative w-72 lg:w-80">
            {/* Polaroid Camera Illustration */}
            <div className="relative">
              {/* Camera body */}
              <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-3xl shadow-2xl p-8 relative">
                {/* Top section */}
                <div className="bg-gray-800 rounded-t-2xl h-16 -mx-8 -mt-8 mb-6 relative">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-3 bg-gray-700 rounded-full"></div>
                </div>

                {/* Lens */}
                <div className="w-32 h-32 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-900 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-black rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-black rounded-full opacity-50"></div>
                    </div>
                  </div>
                </div>

                {/* Rainbow stripe */}
                <div className="flex justify-center gap-0.5 mb-4">
                  <div className="w-2 h-12 bg-blue-400 rounded-full"></div>
                  <div className="w-2 h-12 bg-green-400 rounded-full"></div>
                  <div className="w-2 h-12 bg-yellow-400 rounded-full"></div>
                  <div className="w-2 h-12 bg-orange-400 rounded-full"></div>
                  <div className="w-2 h-12 bg-red-400 rounded-full"></div>
                </div>

                {/* Bottom section */}
                <div className="bg-gray-800 rounded-b-2xl h-20 -mx-8 -mb-8 flex items-center justify-center">
                  <span className="text-gray-400 text-xs tracking-widest">POLAROID LAND CAMERA</span>
                </div>
              </div>

              {/* OneStep label */}
              <div className="absolute top-20 left-4 bg-gray-700 text-white text-xs px-3 py-1 rounded-full">
                OneStep
              </div>

              {/* Red button */}
              <div className="absolute top-28 left-4 w-8 h-8 bg-red-500 rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Gallery Section - Unchanged */}
      <section className="px-8 py-8 bg-gray-50">
        <GallerySection />
      </section>
    </div>
  )
}
