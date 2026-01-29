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

const initialState: GallerySliceState = {
  items: []
}

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    loadGalleryFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(GALLERY_KEY)
        if (stored) {
          state.items = JSON.parse(stored)
        }
      }
    },
    addGalleryItem: (state, action: PayloadAction<Omit<GalleryItem, 'id' | 'createdAt'>>) => {
      const newItem: GalleryItem = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      state.items = [newItem, ...state.items].slice(0, 20)
      if (typeof window !== 'undefined') {
        localStorage.setItem(GALLERY_KEY, JSON.stringify(state.items))
      }
    },
    clearGallery: (state) => {
      state.items = []
      if (typeof window !== 'undefined') {
        localStorage.removeItem(GALLERY_KEY)
      }
    }
  }
})

export const { loadGalleryFromStorage, addGalleryItem, clearGallery } = gallerySlice.actions
export default gallerySlice.reducer
