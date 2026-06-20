import { useCallback } from 'react'
import './WidgetPanel.css'

const SITE_INFO = {
  kite: {
    bg: 'linear-gradient(135deg, #1a1f3a 0%, #0f1525 100%)',
    accentBg: 'rgba(76, 110, 245, 0.08)',
    desc: 'View live candlestick charts, technical indicators, and price action for the selected instrument.',
    features: ['Candlestick Chart', 'Technical Indicators', 'Live Price Feed', 'Order Placement'],
  },
  sensibull: {
    bg: 'linear-gradient(135deg, #1f1a0f 0%, #251c05 100%)',
    accentBg: 'rgba(245, 158, 11, 0.08)',
    desc: 'Analyse open interest across strikes, see OI changes, and spot option chain trends.',
    features: ['OI by Strike', 'OI Change Chart', 'Option Chain', 'Max Pain Level'],
  },
  niftytrader: {
    bg: 'linear-gradient(135deg, #0f1f18 0%, #051a10 100%)',
    accentBg: 'rgba(16, 185, 129, 0.08)',
    desc: 'Track Put-Call Ratio to gauge market sentiment and identify potential reversals.',
    features: ['PCR Trend', 'Bullish / Bearish Signal', 'Historical PCR', 'Volume PCR'],
  },
}

export default function WidgetPanel({ widget, instrument }) {
  const { id, title, subtitle, url, color, icon, tag } = widget
  const info = SITE_INFO[id]

  const openInTab = useCallback(() => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [url])

  return (
    <div className="widget-panel" style={{ '--accent-color': color }}>
      <div className="panel-header">
        <div className="panel-header-left">
          <span className="panel-icon">{icon}</span>
          <div className="panel-titles">
            <span className="panel-title">{title}</span>
            <span className="panel-subtitle">{subtitle}</span>
          </div>
          <span className="panel-tag" style={{ color, borderColor: color, background: `${color}18` }}>
            {tag}
          </span>
        </div>
        <div className="panel-actions">
          <button className="panel-open-btn" onClick={openInTab} style={{ '--btn-color': color }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Open
          </button>
        </div>
      </div>

      <div className="panel-body" style={{ background: info.bg }}>
        <div className="launcher-card">
          {/* Site badge */}
          <div className="launcher-badge" style={{ background: info.accentBg, borderColor: `${color}40` }}>
            <span className="launcher-icon">{icon}</span>
            <span className="launcher-site-name" style={{ color }}>{subtitle}</span>
          </div>

          {/* Instrument pill */}
          <div className="launcher-instrument" style={{ color, borderColor: `${color}50`, background: `${color}12` }}>
            <span className="instrument-dot" style={{ background: color }}></span>
            {instrument.label}
            <span className="instrument-symbol">{instrument.symbol}</span>
          </div>

          {/* Description */}
          <p className="launcher-desc">{info.desc}</p>

          {/* Features */}
          <div className="launcher-features">
            {info.features.map(f => (
              <span key={f} className="feature-chip" style={{ borderColor: `${color}30`, color: `${color}cc` }}>
                {f}
              </span>
            ))}
          </div>

          {/* CTA */}
          <button className="launcher-cta" onClick={openInTab} style={{ background: color }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Open {subtitle} for {instrument.symbol}
          </button>

          {/* Footer note */}
          <p className="launcher-note">
            Opens in a new tab · your login session is preserved
          </p>
        </div>
      </div>
    </div>
  )
}
