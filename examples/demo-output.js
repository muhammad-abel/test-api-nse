/**
 * Demo Output - Menampilkan Contoh Output API
 *
 * File ini menunjukkan bagaimana output dari API akan terlihat
 * tanpa perlu koneksi ke NSE (menggunakan mock data)
 */

console.log('=== DEMO OUTPUT STOCK NSE INDIA API ===\n');
console.log('Catatan: Ini adalah data contoh untuk menunjukkan format output\n');
console.log('='.repeat(80));

// 1. getAllStockSymbols()
console.log('\n1. GET ALL STOCK SYMBOLS');
console.log('-'.repeat(80));
const mockSymbols = [
  '20MICRONS', 'RELIANCE', 'TCS', 'INFY', 'HDFCBANK',
  'ICICIBANK', 'WIPRO', 'BHARTIARTL', 'ITC', 'SBIN'
];
console.log(`Total saham tersedia: ${mockSymbols.length} (contoh, sebenarnya 2000+)`);
console.log('Contoh symbols:', mockSymbols);

// 2. getEquityDetails()
console.log('\n\n2. GET EQUITY DETAILS (RELIANCE)');
console.log('-'.repeat(80));
const mockEquityDetails = {
  info: {
    symbol: 'RELIANCE',
    companyName: 'Reliance Industries Limited',
    industry: 'REFINERIES'
  },
  priceInfo: {
    lastPrice: 2456.75,
    change: 23.50,
    pChange: 0.97,
    previousClose: 2433.25,
    open: 2440.00,
    intraDayHighLow: {
      min: 2435.00,
      max: 2465.80
    },
    '52WeekHighLow': {
      min: 2116.50,
      max: 3217.60
    }
  },
  metadata: {
    marketCap: 16630000000000,
    pdSectorPe: 21.45,
    industry: 'REFINERIES'
  }
};
console.log('Detail RELIANCE:');
console.log(JSON.stringify(mockEquityDetails, null, 2));

// 3. getEquityHistoricalData()
console.log('\n\n3. GET HISTORICAL DATA (TCS - 5 hari terakhir)');
console.log('-'.repeat(80));
const mockHistoricalData = [
  {
    CH_TIMESTAMP: '2024-11-12',
    CH_OPENING_PRICE: 4080.00,
    CH_TRADE_HIGH_PRICE: 4125.50,
    CH_TRADE_LOW_PRICE: 4065.30,
    CH_CLOSING_PRICE: 4115.75,
    CH_TOT_TRADED_QTY: 1234567,
    VWAP: 4098.45
  },
  {
    CH_TIMESTAMP: '2024-11-11',
    CH_OPENING_PRICE: 4075.00,
    CH_TRADE_HIGH_PRICE: 4090.25,
    CH_TRADE_LOW_PRICE: 4045.00,
    CH_CLOSING_PRICE: 4075.80,
    CH_TOT_TRADED_QTY: 987654,
    VWAP: 4065.30
  },
  {
    CH_TIMESTAMP: '2024-11-08',
    CH_OPENING_PRICE: 4050.00,
    CH_TRADE_HIGH_PRICE: 4085.00,
    CH_TRADE_LOW_PRICE: 4040.00,
    CH_CLOSING_PRICE: 4060.50,
    CH_TOT_TRADED_QTY: 1100000,
    VWAP: 4058.25
  }
];
console.log(`Total data: ${mockHistoricalData.length} hari`);
console.log('\nData terbaru:');
console.log(JSON.stringify(mockHistoricalData[0], null, 2));

// 4. getEquityIntradayData()
console.log('\n\n4. GET INTRADAY DATA (INFY)');
console.log('-'.repeat(80));
const mockIntradayData = {
  identifier: 'INFYEQN',
  lastPrice: 1678.90,
  change: 12.45,
  pChange: 0.75,
  previousClose: 1666.45,
  open: 1670.00,
  intraDayHighLow: {
    min: 1668.00,
    max: 1685.50
  },
  totalTradedVolume: 5678901,
  totalTradedValue: 9512345678.90,
  lastUpdateTime: '13-Nov-2024 15:59:32',
  yearHigh: 1903.90,
  yearLow: 1358.00
};
console.log('Intraday data INFY:');
console.log(JSON.stringify(mockIntradayData, null, 2));

// 5. getTopGainers()
console.log('\n\n5. TOP GAINERS (Top 5)');
console.log('-'.repeat(80));
const mockTopGainers = [
  { symbol: 'ADANIPORTS', lastPrice: 1234.50, pChange: 7.45, change: 85.60 },
  { symbol: 'TATAPOWER', lastPrice: 345.80, pChange: 6.56, change: 21.30 },
  { symbol: 'TATASTEEL', lastPrice: 135.75, pChange: 5.89, change: 7.55 },
  { symbol: 'HINDALCO', lastPrice: 567.90, pChange: 4.23, change: 23.05 },
  { symbol: 'JSWSTEEL', lastPrice: 789.60, pChange: 3.78, change: 28.75 }
];
mockTopGainers.forEach((stock, i) => {
  console.log(`${i+1}. ${stock.symbol.padEnd(15)} ₹${stock.lastPrice.toFixed(2).padStart(10)} ↑ +${stock.pChange}%`);
});

// 6. getTopLosers()
console.log('\n\n6. TOP LOSERS (Top 5)');
console.log('-'.repeat(80));
const mockTopLosers = [
  { symbol: 'BAJFINANCE', lastPrice: 6543.25, pChange: -3.46, change: -234.50 },
  { symbol: 'APOLLOHOSP', lastPrice: 5234.80, pChange: -2.89, change: -155.60 },
  { symbol: 'ASIANPAINT', lastPrice: 2987.50, pChange: -2.34, change: -71.75 },
  { symbol: 'TITAN', lastPrice: 3456.90, pChange: -1.98, change: -69.70 },
  { symbol: 'NESTLEIND', lastPrice: 23456.75, pChange: -1.67, change: -398.25 }
];
mockTopLosers.forEach((stock, i) => {
  console.log(`${i+1}. ${stock.symbol.padEnd(15)} ₹${stock.lastPrice.toFixed(2).padStart(10)} ↓ ${stock.pChange}%`);
});

// 7. getIndexDetails()
console.log('\n\n7. INDEX DETAILS (NIFTY 50)');
console.log('-'.repeat(80));
const mockIndexDetails = {
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
  advances: 32,
  declines: 18
};
console.log('NIFTY 50:');
console.log(JSON.stringify(mockIndexDetails, null, 2));

// 8. Stock Tracker Summary
console.log('\n\n8. STOCK TRACKER SUMMARY');
console.log('-'.repeat(80));
const mockWatchlist = [
  {
    symbol: 'RELIANCE',
    companyName: 'Reliance Industries Limited',
    lastPrice: 2456.75,
    pChange: 0.97,
    change: 23.50,
    dayLow: 2435.00,
    dayHigh: 2465.80,
    weeklyChange: 2.34,
    yearLow: 2116.50,
    yearHigh: 3217.60,
    pe: 21.45
  },
  {
    symbol: 'TCS',
    companyName: 'Tata Consultancy Services Limited',
    lastPrice: 4115.75,
    pChange: 0.98,
    change: 39.95,
    dayLow: 4065.30,
    dayHigh: 4125.50,
    weeklyChange: 1.87,
    yearLow: 3311.00,
    yearHigh: 4259.00,
    pe: 28.67
  },
  {
    symbol: 'INFY',
    companyName: 'Infosys Limited',
    lastPrice: 1678.90,
    pChange: 0.75,
    change: 12.45,
    dayLow: 1668.00,
    dayHigh: 1685.50,
    weeklyChange: 3.21,
    yearLow: 1358.00,
    yearHigh: 1903.90,
    pe: 25.34
  }
];

console.log('\n╔════════════════════════════════════════════════════════════════════════╗');
console.log('║                    STOCK TRACKER - WATCHLIST                           ║');
console.log('╚════════════════════════════════════════════════════════════════════════╝\n');

mockWatchlist.forEach((stock, i) => {
  const changeIndicator = stock.pChange >= 0 ? '↑' : '↓';
  const weeklyIndicator = stock.weeklyChange >= 0 ? '↑' : '↓';

  console.log(`${i+1}. ${stock.symbol} - ${stock.companyName}`);
  console.log(`   Harga: ₹${stock.lastPrice} ${changeIndicator} ${stock.change} (${stock.pChange}%)`);
  console.log(`   Hari ini: L ${stock.dayLow} - H ${stock.dayHigh}`);
  console.log(`   Perubahan Mingguan: ${weeklyIndicator} ${stock.weeklyChange}%`);
  console.log(`   52W Range: ₹${stock.yearLow} - ₹${stock.yearHigh}`);
  console.log(`   P/E Ratio: ${stock.pe}`);
  console.log('   ' + '-'.repeat(76));
});

// Summary
const gainers = mockWatchlist.filter(s => s.pChange > 0);
const losers = mockWatchlist.filter(s => s.pChange < 0);

console.log('\n📊 ANALISIS WATCHLIST:\n');
console.log(`   Gainers: ${gainers.length} saham`);
console.log(`   Losers: ${losers.length} saham`);
console.log(`   Flat: ${mockWatchlist.length - gainers.length - losers.length} saham`);

if (gainers.length > 0) {
  const bestGainer = gainers.reduce((max, s) => s.pChange > max.pChange ? s : max);
  console.log(`   Best Performer: ${bestGainer.symbol} (+${bestGainer.pChange}%)`);
}

console.log('\n' + '='.repeat(80));
console.log('\n✓ Demo selesai!');
console.log('\nCATATAN:');
console.log('- Ini adalah data contoh untuk demonstrasi format output');
console.log('- Data real akan bervariasi tergantung kondisi pasar');
console.log('- Untuk data live, pastikan koneksi ke NSE API berhasil');
console.log('- Jika mendapat error 403, coba jalankan di environment berbeda');
console.log('  atau gunakan VPN dengan IP India');
