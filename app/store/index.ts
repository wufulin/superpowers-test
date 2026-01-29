import { configureStore } from '@reduxjs/toolkit'
import viewReducer from './slices/viewSlice'
import imageReducer from './slices/imageSlice'
import paramsReducer from './slices/paramsSlice'

export const store = configureStore({
  reducer: {
    view: viewReducer,
    image: imageReducer,
    params: paramsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
