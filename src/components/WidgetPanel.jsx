import { useState, useRef, useCallback, useEffect } from 'react'
import './WidgetPanel.css'

const EXTENSION_URL  = 'https://github.com/subbajandyala/multiFrameTrading/tree/main/chrome-extension'
const LOCAL_PROXY_URL = 'https://github.com/subbajandyala/multiFrameTrading/tree/main/local-proxy'

function BlockedOverlay({ subtitle, color, onReload, onOpen }) {
  const [tab, setTab] = useState('desktop')

  return (
    <div className="panel-overlay blocked-overlay">
      <div className="blocked-content">
        <div className="blocked-icon">🔌</div>
        <h3 className="blocked-title">{subtitle} blocks embedding</h3>
        <p className="blocked-desc">Choose your device to see the setup steps.</p>

        <div className="device-tabs">
          <button
            className={`device-tab ${tab === 'desktop' ? 'active' : ''}`}
            style={tab === 'desktop' ? { borderColor: color, color } : {}}
            onClick={() => setTab('desktop')}
          >
            💻 Desktop / Android
          </button>
          <button
            className={`device-tab ${tab === 'mobile' ? 'active' : ''}`}
            style={tab === 'mobile' ? { borderColor: color, color } : {}}
            onClick={() => setTab('mobile')}
          >
            📱 iPhone / Any device
          </button>
        </div>

        {tab === 'desktop' && (
          <div className="steps">
            <p className="steps-title">Chrome Extension (one-time install)</p>
            <div className="step">
              <span className="step-num" style={{ background: color }}>1</span>
              <span>Download the <a href={EXTENSION_URL} target="_blank" rel="noreferrer" style={{ color }}><code>chrome-extension</code></a> folder from GitHub</span>
            </div>
            <div className="step">
              <span className="step-num" style={{ background: color }}>2</span>
              <span>Open <code>chrome://extensions</code> → enable <strong>Developer mode</strong></span>
            </div>
            <div className="step">
              <span className="step-num" style={{ background: color }}>3</span>
              <span>Click <strong>Load unpacked</strong> → select the <code>chrome-extension</code> folder</span>
            </div>
            <div className="step">
              <span className="step-num" style={{ background: color }}>4</span>
              <span>Reload this page — all panels will show live content</span>
            </div>
            <p className="steps-note">Android users: use <strong>Kiwi Browser</strong> which supports Chrome extensions.</p>
          </div>
        )}

        {tab === 'mobile' && (
          <div className="steps">
            <p className="steps-title">Local Proxy — run on your laptop, use on any phone</p>
            <div className="step">
              <span className="step-num" style={{ background: color }}>1</span>
              <span>Clone the repo, then:<br /><code>cd local-proxy &amp;&amp; npm install &amp;&amp; node proxy.js</code></span>
            </div>
            <div className="step">
              <span className="step-num" style={{ background: color }}>2</span>
              <span>Phone WiFi → <strong>HTTP Proxy → Manual</strong><br />Server: your laptop IP &nbsp;·&nbsp; Port: <strong>8080</strong></span>
            </div>
            <div className="step">
              <span className="step-num" style={{ background: color }}>3</span>
              <span>Install the CA cert the proxy prints (AirDrop it to iPhone → tap → trust in Settings)</span>
            </div>
            <div className="step">
              <span className="step-num" style={{ background: color }}>4</span>
              <span>Open this dashboard on your phone — all 3 panels load live</span>
            </div>
            <p className="steps-note">Full instructions in the <a href={LOCAL_PROXY_URL} target="_blank" rel="noreferrer" style={{ color }}><code>local-proxy</code></a> folder on GitHub.</p>
          </div>
        )}

        <div className="blocked-actions">
          <button className="reload-btn" onClick={onReload} style={{ background: color }}>
            Reload panel
          </button>
          <button className="open-fallback-btn" onClick={onOpen}>
            Open in tab
          </button>
        </div>
      </div>
    </div>
  )
}

export default function WidgetPanel({ widget, instrument }) {
  const { id, title, subtitle, url, color, icon, tag } = widget
  const [reloadKey, setReloadKey] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [blocked, setBlocked] = useState(false)
  const iframeRef = useRef(null)
  const timerRef = useRef(null)

  // Reload when instrument changes
  useEffect(() => {
    setReloadKey(k => k + 1)
    setIsLoading(true)
    setBlocked(false)
  }, [instrument.id])

  // Cleanup timer on unmount
  useEffect(() => () => clearTimeout(timerRef.current), [])

  const reload = useCallback(() => {
    clearTimeout(timerRef.current)
    setReloadKey(k => k + 1)
    setIsLoading(true)
    setBlocked(false)
  }, [])

  const openInTab = useCallback(() => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [url])

  const handleLoad = useCallback(() => {
    clearTimeout(timerRef.current)
    try {
      const doc = iframeRef.current?.contentDocument
      // Accessible same-origin blank doc = blocked by X-Frame-Options
      if (doc && doc.body != null && doc.body.innerHTML === '') {
        setBlocked(true)
      }
      // Non-empty same-origin doc = loaded (rare for external sites)
    } catch {
      // SecurityError = cross-origin content loaded = extension is working
    }
    setIsLoading(false)
  }, [])

  const handleError = useCallback(() => {
    clearTimeout(timerRef.current)
    setIsLoading(false)
    setBlocked(true)
  }, [])

  // Timeout fallback: if load never fires, assume blocked
  const handleIframeStart = useCallback(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setIsLoading(false)
      setBlocked(true)
    }, 12000)
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
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
          </button>
          <button className="panel-btn open-btn" onClick={openInTab}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Open
          </button>
        </div>
      </div>

      <div className="panel-body">
        {/* Always mount iframe so it tries to load */}
        <iframe
          key={`${id}-${reloadKey}`}
          ref={iframeRef}
          src={url}
          title={`${title} - ${instrument.label}`}
          className={`panel-iframe ${(isLoading || blocked) ? 'hidden' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          onLoadStart={handleIframeStart}
          allow="fullscreen"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
        />

        {isLoading && !blocked && (
          <div className="panel-overlay loading-overlay">
            <div className="spinner" style={{ borderTopColor: color }}></div>
            <span>Loading {subtitle}…</span>
          </div>
        )}

        {blocked && (
          <BlockedOverlay
            subtitle={subtitle}
            color={color}
            onReload={reload}
            onOpen={openInTab}
          />
        )}
      </div>
    </div>
  )
}
