import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type FrameStyle =
  | 'black-marble'
  | 'spring-flower'
  | 'neon-party'
  | 'pink-dot'
  | 'pizza'
  | 'starry-purple'

interface FrameSliceState {
  selectedFrame: FrameStyle
}

const initialState: FrameSliceState = {
  selectedFrame: 'black-marble'
}

const frameSlice = createSlice({
  name: 'frame',
  initialState,
  reducers: {
    setFrame: (state, action: PayloadAction<FrameStyle>) => {
      state.selectedFrame = action.payload
    }
  }
})

export const { setFrame } = frameSlice.actions
export default frameSlice.reducer
