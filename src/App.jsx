import { useState } from 'react'
import Header from './components/Header.jsx'
import Dashboard from './components/Dashboard.jsx'
import { DEFAULT_INSTRUMENT } from './instruments.js'
import './App.css'

export default function App() {
  const [layout, setLayout] = useState('default')
  const [instrument, setInstrument] = useState(DEFAULT_INSTRUMENT)

  return (
    <div className="app">
      <Header
        layout={layout}
        onLayoutChange={setLayout}
        instrument={instrument}
        onInstrumentChange={setInstrument}
      />
      <Dashboard layout={layout} instrument={instrument} />
    </div>
  )
}
