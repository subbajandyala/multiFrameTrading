import { useState, useRef, useCallback, useEffect } from 'react'
import './WidgetPanel.css'

export default function WidgetPanel({ widget, instrument }) {
  const { title, subtitle, url, color, icon, tag } = widget
  const [reloadKey, setReloadKey] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [blocked, setBlocked] = useState(false)
  const iframeRef = useRef(null)

  // Reload whenever instrument changes
  useEffect(() => {
    setReloadKey(k => k + 1)
    setIsLoading(true)
    setBlocked(false)
  }, [instrument.id])

  const reload = useCallback(() => {
    setReloadKey(k => k + 1)
    setIsLoading(true)
    setBlocked(false)
  }, [])

  const openInTab = useCallback(() => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [url])

  const handleLoad = useCallback(() => {
    try {
      const doc = iframeRef.current?.contentDocument
      if (doc && doc.body && doc.body.innerHTML === '') {
        setBlocked(true)
      }
    } catch {
      // Cross-origin but loaded — that's fine
    }
    setIsLoading(false)
  }, [])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setBlocked(true)
  }, [])

  return (
    <div className="widget-panel">
      <div className="panel-header" style={{ '--accent-color': color }}>
        <div className="panel-header-left">
          <span className="panel-icon">{icon}</span>
          <div className="panel-titles">
            <span className="panel-title">{title}</span>
            <span className="panel-subtitle">{subtitle} · {instrument.symbol}</span>
          </div>
          <span className="panel-tag" style={{ color, borderColor: color, background: `${color}18` }}>
            {tag}
          </span>
        </div>
        <div className="panel-actions">
          <button className="panel-btn" onClick={reload} title="Reload">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
          </button>
          <button className="panel-btn open-btn" onClick={openInTab} title={`Open ${subtitle} in new tab`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Open
          </button>
        </div>
      </div>

      <div className="panel-body">
        {isLoading && (
          <div className="panel-overlay loading">
            <div className="spinner"></div>
            <span>Loading {subtitle} · {instrument.symbol}…</span>
          </div>
        )}

        {blocked && !isLoading && (
          <div className="panel-overlay blocked">
            <div className="blocked-icon">🔒</div>
            <p className="blocked-title">{subtitle} blocks embedding</p>
            <p className="blocked-desc">
              This site prevents loading inside iframes (X-Frame-Options security policy).
              Open it in a dedicated tab — your login session will carry over.
            </p>
            <div className="blocked-actions">
              <button className="blocked-open-btn" onClick={openInTab}>
                Open {subtitle} for {instrument.symbol} →
              </button>
              <button className="blocked-retry-btn" onClick={reload}>
                Retry
              </button>
            </div>
          </div>
        )}

        {!blocked && (
          <iframe
            key={`${widget.id}-${reloadKey}`}
            ref={iframeRef}
            src={url}
            title={`${title} - ${instrument.label}`}
            className="panel-iframe"
            onLoad={handleLoad}
            onError={handleError}
            allow="fullscreen"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
          />
        )}
      </div>
    </div>
  )
}
