import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ParamsSliceState {
  retroIntensity: number
  filmTexture: number
}

const initialState: ParamsSliceState = {
  retroIntensity: 60,
  filmTexture: 50
}

const paramsSlice = createSlice({
  name: 'params',
  initialState,
  reducers: {
    setRetroIntensity: (state, action: PayloadAction<number>) => {
      state.retroIntensity = Math.max(0, Math.min(100, action.payload))
    },
    setFilmTexture: (state, action: PayloadAction<number>) => {
      state.filmTexture = Math.max(0, Math.min(100, action.payload))
    },
    resetParams: (state) => {
      state.retroIntensity = 60
      state.filmTexture = 50
    }
  }
})

export const { setRetroIntensity, setFilmTexture, resetParams } = paramsSlice.actions
export default paramsSlice.reducer
