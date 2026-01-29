import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface GalleryItem {
  id: string
  thumbnail: string
  fullImage: string
  createdAt: string
}

interface GallerySliceState {
  items: GalleryItem[]
}

const GALLERY_KEY = 'polagram-gallery'

const loadFromStorage = (): GalleryItem[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(GALLERY_KEY)
  return stored ? JSON.parse(stored) : []
}

const initialState: GallerySliceState = {
  items: loadFromStorage()
}

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    addGalleryItem: (state, action: PayloadAction<Omit<GalleryItem, 'id' | 'createdAt'>>) => {
      const newItem: GalleryItem = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      state.items = [newItem, ...state.items].slice(0, 20)
      localStorage.setItem(GALLERY_KEY, JSON.stringify(state.items))
    },
    clearGallery: (state) => {
      state.items = []
      localStorage.removeItem(GALLERY_KEY)
    }
  }
})

export const { addGalleryItem, clearGallery } = gallerySlice.actions
export default gallerySlice.reducer
