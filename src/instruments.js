// Maps each instrument to its URL on each platform
export const INSTRUMENTS = [
  {
    id: 'nifty50',
    label: 'NIFTY 50',
    symbol: 'NIFTY',
    kiteUrl: 'https://kite.zerodha.com/chart/ext/ciq/NSE/NIFTY%2050/15',
    sensibullUrl: 'https://sensibull.com/options/nifty',
    niftytraderUrl: 'https://niftytrader.in/pcr/',
  },
  {
    id: 'banknifty',
    label: 'BANK NIFTY',
    symbol: 'BANKNIFTY',
    kiteUrl: 'https://kite.zerodha.com/chart/ext/ciq/NSE/NIFTY%20BANK/15',
    sensibullUrl: 'https://sensibull.com/options/banknifty',
    niftytraderUrl: 'https://niftytrader.in/',
  },
  {
    id: 'finnifty',
    label: 'FIN NIFTY',
    symbol: 'FINNIFTY',
    kiteUrl: 'https://kite.zerodha.com/chart/ext/ciq/NSE/NIFTY%20FIN%20SERVICE/15',
    sensibullUrl: 'https://sensibull.com/options/finnifty',
    niftytraderUrl: 'https://niftytrader.in/',
  },
  {
    id: 'midcpnifty',
    label: 'MIDCAP NIFTY',
    symbol: 'MIDCPNIFTY',
    kiteUrl: 'https://kite.zerodha.com/chart/ext/ciq/NSE/NIFTY%20MID%20SELECT/15',
    sensibullUrl: 'https://sensibull.com/options/midcpnifty',
    niftytraderUrl: 'https://niftytrader.in/',
  },
  {
    id: 'sensex',
    label: 'SENSEX',
    symbol: 'SENSEX',
    kiteUrl: 'https://kite.zerodha.com/chart/ext/ciq/BSE/SENSEX/15',
    sensibullUrl: 'https://sensibull.com/options/sensex',
    niftytraderUrl: 'https://niftytrader.in/',
  },
  {
    id: 'reliance',
    label: 'RELIANCE',
    symbol: 'RELIANCE',
    kiteUrl: 'https://kite.zerodha.com/chart/ext/ciq/NSE/RELIANCE/15',
    sensibullUrl: 'https://sensibull.com/options/reliance',
    niftytraderUrl: 'https://niftytrader.in/',
  },
  {
    id: 'tcs',
    label: 'TCS',
    symbol: 'TCS',
    kiteUrl: 'https://kite.zerodha.com/chart/ext/ciq/NSE/TCS/15',
    sensibullUrl: 'https://sensibull.com/options/tcs',
    niftytraderUrl: 'https://niftytrader.in/',
  },
  {
    id: 'hdfcbank',
    label: 'HDFC BANK',
    symbol: 'HDFCBANK',
    kiteUrl: 'https://kite.zerodha.com/chart/ext/ciq/NSE/HDFCBANK/15',
    sensibullUrl: 'https://sensibull.com/options/hdfcbank',
    niftytraderUrl: 'https://niftytrader.in/',
  },
  {
    id: 'infy',
    label: 'INFOSYS',
    symbol: 'INFY',
    kiteUrl: 'https://kite.zerodha.com/chart/ext/ciq/NSE/INFY/15',
    sensibullUrl: 'https://sensibull.com/options/infy',
    niftytraderUrl: 'https://niftytrader.in/',
  },
]

export const DEFAULT_INSTRUMENT = INSTRUMENTS[0]

export function getWidgetUrls(instrument) {
  return {
    kite: instrument.kiteUrl,
    sensibull: instrument.sensibullUrl,
    niftytrader: instrument.niftytraderUrl,
  }
}
