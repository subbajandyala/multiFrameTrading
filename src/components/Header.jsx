import { useState, useRef, useEffect } from 'react'
import { INSTRUMENTS } from '../instruments.js'
import './Header.css'

const layouts = [
  { id: 'default', label: 'Chart Top' },
  { id: 'stacked', label: 'Stacked' },
  { id: 'side', label: 'Side by Side' },
]

function openAll(instrument) {
  window.open(instrument.kiteUrl, '_blank', 'noopener,noreferrer')
  setTimeout(() => window.open(instrument.sensibullUrl, '_blank', 'noopener,noreferrer'), 200)
  setTimeout(() => window.open(instrument.niftytraderUrl, '_blank', 'noopener,noreferrer'), 400)
}

export default function Header({ layout, onLayoutChange, instrument, onInstrumentChange }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [time, setTime] = useState(new Date())
  const dropdownRef = useRef(null)

  // Update clock every second
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = INSTRUMENTS.filter(i =>
    i.label.toLowerCase().includes(query.toLowerCase()) ||
    i.symbol.toLowerCase().includes(query.toLowerCase())
  )

  function select(inst) {
    onInstrumentChange(inst)
    setOpen(false)
    setQuery('')
  }

  const timeStr = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateStr = time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <header className="header">
      <div className="header-left">
        <span className="logo">📈</span>
        <div className="header-title">
          <span className="title-main">Multi-Frame Trading</span>
          <span className="title-sub">Dashboard</span>
        </div>
        <div className="market-status">
          <span className="status-dot live"></span>
          <span className="status-text">NSE Live</span>
        </div>
      </div>

      {/* Instrument Search */}
      <div className="instrument-search" ref={dropdownRef}>
        <div
          className={`search-box ${open ? 'focused' : ''}`}
          onClick={() => setOpen(true)}
        >
          <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search instrument…"
            value={open ? query : instrument.label}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
          />
          <span className="selected-symbol">{open ? '' : instrument.symbol}</span>
        </div>

        {open && (
          <div className="search-dropdown">
            <div className="dropdown-hint">Select instrument — all 3 panels update</div>
            {filtered.length === 0 ? (
              <div className="dropdown-empty">No results for "{query}"</div>
            ) : (
              filtered.map(inst => (
                <button
                  key={inst.id}
                  className={`dropdown-item ${inst.id === instrument.id ? 'active' : ''}`}
                  onClick={() => select(inst)}
                >
                  <span className="item-symbol">{inst.symbol}</span>
                  <span className="item-label">{inst.label}</span>
                  {inst.id === instrument.id && <span className="item-check">✓</span>}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Open All */}
      <button className="open-all-btn" onClick={() => openAll(instrument)} title={`Open Kite, Sensibull & NiftyTrader for ${instrument.symbol}`}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
        Open All 3
      </button>

      {/* Layout switcher */}
      <div className="layout-switcher">
        <span className="layout-label">Layout:</span>
        {layouts.map(l => (
          <button
            key={l.id}
            className={`layout-btn ${layout === l.id ? 'active' : ''}`}
            onClick={() => onLayoutChange(l.id)}
            title={l.label}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="header-right">
        <div className="datetime">
          <span className="time">{timeStr}</span>
          <span className="date">{dateStr}</span>
        </div>
      </div>
    </header>
  )
}
