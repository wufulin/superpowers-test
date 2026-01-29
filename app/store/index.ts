import { configureStore } from '@reduxjs/toolkit'
import viewReducer from './slices/viewSlice'
import imageReducer from './slices/imageSlice'

export const store = configureStore({
  reducer: {
    view: viewReducer,
    image: imageReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
