import { configureStore } from '@reduxjs/toolkit'
import viewReducer from './slices/viewSlice'
import imageReducer from './slices/imageSlice'
import paramsReducer from './slices/paramsSlice'
import frameReducer from './slices/frameSlice'

export const store = configureStore({
  reducer: {
    view: viewReducer,
    image: imageReducer,
    params: paramsReducer,
    frame: frameReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
