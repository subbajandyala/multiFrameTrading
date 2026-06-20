import WidgetPanel from './WidgetPanel.jsx'
import './Dashboard.css'

function getWidgets(instrument) {
  return [
    {
      id: 'kite',
      title: 'Kite Chart',
      subtitle: 'Zerodha',
      url: instrument.kiteUrl,
      color: '#4c6ef5',
      icon: '📊',
      tag: 'CHART',
    },
    {
      id: 'sensibull',
      title: 'Open Interest',
      subtitle: 'Sensibull',
      url: instrument.sensibullUrl,
      color: '#f59e0b',
      icon: '📉',
      tag: 'OI',
    },
    {
      id: 'niftytrader',
      title: 'PCR',
      subtitle: 'NiftyTrader',
      url: instrument.niftytraderUrl,
      color: '#10b981',
      icon: '⚖️',
      tag: 'PCR',
    },
  ]
}

export default function Dashboard({ layout, instrument }) {
  const widgets = getWidgets(instrument)

  return (
    <div className={`dashboard layout-${layout}`}>
      {layout === 'default' && (
        <>
          <div className="panel-area top-area">
            <WidgetPanel widget={widgets[0]} instrument={instrument} />
          </div>
          <div className="panel-area bottom-area">
            <WidgetPanel widget={widgets[1]} instrument={instrument} />
            <WidgetPanel widget={widgets[2]} instrument={instrument} />
          </div>
        </>
      )}
      {layout === 'stacked' && (
        <div className="panel-area stacked-area">
          {widgets.map(w => <WidgetPanel key={w.id} widget={w} instrument={instrument} />)}
        </div>
      )}
      {layout === 'side' && (
        <div className="panel-area side-area">
          {widgets.map(w => <WidgetPanel key={w.id} widget={w} instrument={instrument} />)}
        </div>
      )}
    </div>
  )
}
