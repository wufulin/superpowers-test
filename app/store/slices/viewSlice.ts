import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ViewState = 'landing' | 'upload' | 'preview' | 'processing' | 'result'

interface ViewSliceState {
  currentView: ViewState
}

const initialState: ViewSliceState = {
  currentView: 'landing'
}

const viewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setView: (state, action: PayloadAction<ViewState>) => {
      state.currentView = action.payload
    }
  }
})

export const { setView } = viewSlice.actions
export default viewSlice.reducer
