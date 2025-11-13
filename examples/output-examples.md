# Contoh Output dari Stock NSE India API

Dokumen ini menunjukkan contoh output yang akan Anda dapatkan dari berbagai fungsi API.

## 1. getAllStockSymbols()

**Output:** Array of string (symbol saham)

```javascript
[
  '20MICRONS',
  '21STCENMGM',
  '3IINFOTECH',
  'A2ZINFRA',
  'AAKASH',
  'AARTECH',
  'AARVI',
  'AAVAS',
  'ABAN',
  'ABB',
  // ... total sekitar 2000+ symbols
]
```

## 2. getEquityDetails(symbol)

**Contoh:** `nse.getEquityDetails('RELIANCE')`

**Output:**

```javascript
{
  info: {
    symbol: 'RELIANCE',
    companyName: 'Reliance Industries Limited',
    industry: 'REFINERIES',
    activeSeries: ['EQ'],
    debtSeries: [],
    isFNOSec: true,
    isCASec: false,
    isSLBSec: true,
    isDebtSec: false,
    isSuspended: false,
    tempSuspendedSeries: [],
    isETFSec: false,
    isDelisted: false,
    isin: 'INE002A01018'
  },
  priceInfo: {
    lastPrice: 2456.75,
    change: 23.50,
    pChange: 0.97,
    previousClose: 2433.25,
    open: 2440.00,
    close: 2456.75,
    vwap: 2448.30,
    lowerCP: '2189.95',
    upperCP: '2676.55',
    intraDayHighLow: {
      min: 2435.00,
      max: 2465.80,
      value: 2456.75
    },
    weekHighLow: {
      min: 2116.50,
      minDate: '14-Mar-2024',
      max: 3217.60,
      maxDate: '08-Jul-2024',
      value: 2456.75
    },
    '52WeekHighLow': {
      min: 2116.50,
      minDate: '14-Mar-2024',
      max: 3217.60,
      maxDate: '08-Jul-2024',
      value: 2456.75
    }
  },
  metadata: {
    series: 'EQ',
    symbol: 'RELIANCE',
    isin: 'INE002A01018',
    status: 'Listed',
    listingDate: '29-Nov-1977',
    industry: 'REFINERIES',
    lastUpdateTime: '13-Nov-2024 15:59:59',
    pdSectorPe: 21.45,
    pdSymbolPe: 21.45,
    pdSectorInd: 'NIFTY 50',
    marketCap: 16630000000000
  },
  securityInfo: {
    boardStatus: 'Main',
    tradingStatus: 'Active',
    tradingSegment: 'Normal Market',
    sessionNo: '-',
    slb: 'Yes',
    classOfShare: 'Equity',
    derivatives: 'Yes',
    surveillance: { surv: null, desc: null },
    faceValue: 10,
    issuedSize: 6765816758
  },
  preOpenMarket: {
    preopen: [...],
    ato: {
      buy: 15234,
      sell: 8976
    },
    IEP: 2440.00,
    totalTradedVolume: 45678,
    finalPrice: 0,
    finalQuantity: 0,
    lastUpdateTime: '13-Nov-2024 09:07:16',
    totalBuyQuantity: 234567,
    totalSellQuantity: 198765,
    atoBuyQty: 15234,
    atoSellQty: 8976
  }
}
```

## 3. getEquityHistoricalData(symbol, range)

**Contoh:** `nse.getEquityHistoricalData('TCS', { start: new Date('2024-10-01'), end: new Date('2024-10-31') })`

**Output:** Array of historical data

```javascript
[
  {
    CH_SYMBOL: 'TCS',
    CH_SERIES: 'EQ',
    CH_TRADE_HIGH_PRICE: 4125.50,
    CH_TRADE_LOW_PRICE: 4065.30,
    CH_OPENING_PRICE: 4080.00,
    CH_CLOSING_PRICE: 4115.75,
    CH_LAST_TRADED_PRICE: 4115.75,
    CH_PREVIOUS_CLS_PRICE: 4075.80,
    CH_TOT_TRADED_QTY: 1234567,
    CH_TOT_TRADED_VAL: 5067891234.50,
    CH_52WEEK_HIGH_PRICE: 4259.00,
    CH_52WEEK_LOW_PRICE: 3311.00,
    CH_TOTAL_TRADES: 45678,
    CH_ISIN: 'INE467B01029',
    CH_TIMESTAMP: '2024-10-31',
    TIMESTAMP: '31-OCT-2024',
    VWAP: 4098.45,
    mTIMESTAMP: '31 Oct 2024'
  },
  {
    CH_SYMBOL: 'TCS',
    CH_SERIES: 'EQ',
    CH_TRADE_HIGH_PRICE: 4090.25,
    CH_TRADE_LOW_PRICE: 4045.00,
    CH_OPENING_PRICE: 4075.00,
    CH_CLOSING_PRICE: 4075.80,
    CH_LAST_TRADED_PRICE: 4075.80,
    CH_PREVIOUS_CLS_PRICE: 4060.50,
    CH_TOT_TRADED_QTY: 987654,
    CH_TOT_TRADED_VAL: 4012345678.90,
    CH_52WEEK_HIGH_PRICE: 4259.00,
    CH_52WEEK_LOW_PRICE: 3311.00,
    CH_TOTAL_TRADES: 34567,
    CH_ISIN: 'INE467B01029',
    CH_TIMESTAMP: '2024-10-30',
    TIMESTAMP: '30-OCT-2024',
    VWAP: 4065.30,
    mTIMESTAMP: '30 Oct 2024'
  }
  // ... data untuk setiap hari trading dalam range
]
```

## 4. getEquityIntradayData(symbol)

**Contoh:** `nse.getEquityIntradayData('INFY')`

**Output:**

```javascript
{
  identifier: 'INFYEQN',
  lastPrice: 1678.90,
  change: 12.45,
  pChange: 0.75,
  previousClose: 1666.45,
  open: 1670.00,
  close: 1678.90,
  vwap: 1675.30,
  lowerCP: '1499.80',
  upperCP: '1833.10',
  pPriceBand: 'No Band',
  basePrice: 1666.45,
  intraDayHighLow: {
    min: 1668.00,
    max: 1685.50,
    value: 1678.90
  },
  weekHighLow: {
    min: 1358.00,
    minDate: '26-Oct-2023',
    max: 1903.90,
    maxDate: '20-Jun-2024',
    value: 1678.90
  },
  totalTradedVolume: 5678901,
  totalTradedValue: 9512345678.90,
  totalMarketCap: 6890000000000,
  ffmc: 6890000000000,
  nearWKH: 11.84,
  nearWKL: 23.64,
  perChange365d: 24.56,
  perChange30d: 5.67,
  lastUpdateTime: '13-Nov-2024 15:59:32',
  yearHigh: 1903.90,
  yearLow: 1358.00
}
```

## 5. getTopGainers()

**Output:**

```javascript
[
  {
    symbol: 'ADANIPORTS',
    series: 'EQ',
    lastPrice: 1234.50,
    change: 85.60,
    pChange: 7.45,
    previousClose: 1148.90,
    open: 1155.00,
    dayHigh: 1245.00,
    dayLow: 1150.00,
    totalTradedVolume: 12345678,
    totalTradedValue: 15234567890.50,
    yearHigh: 1245.00,
    yearLow: 678.90
  },
  {
    symbol: 'TATAPOWER',
    series: 'EQ',
    lastPrice: 345.80,
    change: 21.30,
    pChange: 6.56,
    previousClose: 324.50,
    open: 326.00,
    dayHigh: 348.50,
    dayLow: 325.00,
    totalTradedVolume: 23456789,
    totalTradedValue: 7890123456.70,
    yearHigh: 350.00,
    yearLow: 215.00
  }
  // ... top 10 gainers
]
```

## 6. getTopLosers()

**Output:** (Format sama dengan getTopGainers, tapi pChange negatif)

```javascript
[
  {
    symbol: 'BAJFINANCE',
    series: 'EQ',
    lastPrice: 6543.25,
    change: -234.50,
    pChange: -3.46,
    previousClose: 6777.75,
    open: 6750.00,
    dayHigh: 6755.00,
    dayLow: 6520.00,
    totalTradedVolume: 1234567,
    totalTradedValue: 8012345678.90,
    yearHigh: 7800.00,
    yearLow: 5600.00
  }
  // ... top 10 losers
]
```

## 7. getIndexDetails(indexName)

**Contoh:** `nse.getIndexDetails('NIFTY 50')`

**Output:**

```javascript
{
  name: 'NIFTY 50',
  last: 19456.75,
  change: 125.30,
  pChange: 0.65,
  open: 19350.50,
  high: 19485.20,
  low: 19340.00,
  previousClose: 19331.45,
  yearHigh: 20222.45,
  yearLow: 16828.35,
  pe: 21.34,
  pb: 3.87,
  dy: 1.23,
  declines: 18,
  advances: 32,
  unchanged: 0,
  perChange365d: 15.67,
  perChange30d: 3.45,
  chart365dPath: '...',
  chart30dPath: '...',
  chartTodayPath: '...',
  previousDay: '10-NOV-2024',
  oneWeekAgo: '04-NOV-2024',
  oneMonthAgo: '11-OCT-2024',
  oneYearAgo: '13-NOV-2023'
}
```

## 8. getEquityCorporateInfo(symbol)

**Contoh:** `nse.getEquityCorporateInfo('INFY')`

**Output:**

```javascript
{
  symbol: 'INFY',
  series: 'EQ',
  corporate: [
    {
      exDate: '18-OCT-2024',
      purpose: 'Interim Dividend - Rs 21 Per Share',
      recordDate: '18-OCT-2024',
      bcStartDate: '18-OCT-2024',
      bcEndDate: '18-OCT-2024',
      ndStartDate: null,
      ndEndDate: null,
      ndExDate: null
    },
    {
      exDate: '12-JUL-2024',
      purpose: 'Final Dividend - Rs 19.50 Per Share',
      recordDate: '12-JUL-2024',
      bcStartDate: '12-JUL-2024',
      bcEndDate: '12-JUL-2024',
      ndStartDate: null,
      ndEndDate: null,
      ndExDate: null
    }
    // ... corporate actions lainnya
  ]
}
```

## 9. getTopTurnoverByValue()

**Output:**

```javascript
[
  {
    symbol: 'RELIANCE',
    series: 'EQ',
    lastPrice: 2456.75,
    change: 23.50,
    pChange: 0.97,
    previousClose: 2433.25,
    open: 2440.00,
    dayHigh: 2465.80,
    dayLow: 2435.00,
    totalTradedVolume: 8765432,
    totalTradedValue: 21456789012.50,
    yearHigh: 3217.60,
    yearLow: 2116.50
  },
  {
    symbol: 'TCS',
    series: 'EQ',
    lastPrice: 4115.75,
    change: 39.95,
    pChange: 0.98,
    previousClose: 4075.80,
    open: 4080.00,
    dayHigh: 4125.50,
    dayLow: 4065.30,
    totalTradedVolume: 3456789,
    totalTradedValue: 14234567890.30,
    yearHigh: 4259.00,
    yearLow: 3311.00
  }
  // ... top 10 by turnover value
]
```

## Catatan Penting

1. **Timestamps:** Semua waktu dalam IST (Indian Standard Time)
2. **Currency:** Semua harga dalam Rupee India (₹)
3. **Volume:** Jumlah saham yang diperdagangkan
4. **Value:** Nilai total transaksi dalam Rupee
5. **pChange:** Perubahan persentase
6. **VWAP:** Volume Weighted Average Price
7. **52WeekHighLow:** Harga tertinggi/terendah dalam 52 minggu terakhir

## Format Tanggal yang Digunakan

- `CH_TIMESTAMP`: 'YYYY-MM-DD'
- `TIMESTAMP`: 'DD-MMM-YYYY'
- `mTIMESTAMP`: 'DD Mon YYYY'
- `lastUpdateTime`: 'DD-Mon-YYYY HH:MM:SS'
