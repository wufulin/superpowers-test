'use client'

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setView } from '../store/slices/viewSlice'
import { setOriginalImage } from '../store/slices/imageSlice'
import Header from './Header'

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
      <Header backView="landing" />

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
