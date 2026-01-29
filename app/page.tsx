'use client'

import { useSelector } from 'react-redux'
import { RootState } from './store'
import LandingView from './components/LandingView'

export default function Home() {
  const currentView = useSelector((state: RootState) => state.view.currentView)

  return (
    <main>
      {currentView === 'landing' && <LandingView />}
    </main>
  )
}
