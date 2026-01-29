import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ImageSliceState {
  originalImage: string | null
  processedImage: string | null
}

const initialState: ImageSliceState = {
  originalImage: null,
  processedImage: null
}

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setOriginalImage: (state, action: PayloadAction<string>) => {
      state.originalImage = action.payload
    },
    setProcessedImage: (state, action: PayloadAction<string>) => {
      state.processedImage = action.payload
    },
    clearImages: (state) => {
      state.originalImage = null
      state.processedImage = null
    }
  }
})

export const { setOriginalImage, setProcessedImage, clearImages } = imageSlice.actions
export default imageSlice.reducer
