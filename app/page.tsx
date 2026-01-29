'use client'

import { useSelector } from 'react-redux'
import { RootState } from './store'
import LandingView from './components/LandingView'
import UploadView from './components/UploadView'
import PreviewView from './components/PreviewView'
import ResultView from './components/ResultView'

export default function Home() {
  const currentView = useSelector((state: RootState) => state.view.currentView)

  return (
    <main>
      {currentView === 'landing' && <LandingView />}
      {currentView === 'upload' && <UploadView />}
      {currentView === 'preview' && <PreviewView />}
      {currentView === 'result' && <ResultView />}
    </main>
  )
}
