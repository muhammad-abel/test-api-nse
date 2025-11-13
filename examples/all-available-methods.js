/**
 * All Available Methods - Stock NSE India API
 *
 * File ini menunjukkan SEMUA method yang tersedia di API
 */

import stockNseIndia from 'stock-nse-india';

const { NseIndia } = stockNseIndia;
const nse = new NseIndia();

console.log('=== SEMUA METHOD YANG TERSEDIA DI STOCK-NSE-INDIA API ===\n');

console.log('📊 EQUITY (SAHAM) METHODS:');
console.log('━'.repeat(80));
console.log('✓ nse.getAllStockSymbols()                    - Semua symbol saham');
console.log('✓ nse.getEquityDetails(symbol)                - Detail lengkap saham');
console.log('✓ nse.getEquityHistoricalData(symbol, range)  - Data historical OHLCV');
console.log('✓ nse.getEquityIntradayData(symbol)           - Data intraday real-time');
console.log('✓ nse.getEquityOptionChain(symbol)            - Options chain equity');
console.log('✓ nse.getEquityCorporateInfo(symbol)          - Corporate actions');
console.log('✓ nse.getEquityTradeInfo(symbol)              - Trading statistics');
console.log('');

console.log('📈 INDEX METHODS:');
console.log('━'.repeat(80));
console.log('✓ nse.getEquityStockIndices()                 - Semua index market');
console.log('✓ nse.getIndexDetails(indexName)              - Detail index tertentu');
console.log('✓ nse.getIndexHistoricalData(index, range)    - Historical index data');
console.log('✓ nse.getIndexIntradayData(index)             - Intraday index movements');
console.log('✓ nse.getIndexOptionChain(index)              - Options chain index');
console.log('');

console.log('💰 COMMODITY METHODS:');
console.log('━'.repeat(80));
console.log('✓ nse.getCommodityOptionChain(symbol)         - Commodity options data');
console.log('');

console.log('🔥 MARKET MOVERS METHODS:');
console.log('━'.repeat(80));
console.log('✓ nse.getTopGainers()                         - Top gainers');
console.log('✓ nse.getTopLosers()                          - Top losers');
console.log('✓ nse.getTopTurnoverByValue()                 - Highest turnover by value');
console.log('✓ nse.getTopTurnoverByVolume()                - Highest turnover by volume');
console.log('✓ nse.getGainersAndLosersByIndex(index)       - Gainers/losers per index');
console.log('✓ nse.getMostActiveEquities()                 - Most active stocks');
console.log('');

console.log('🛠️  UTILITY METHODS:');
console.log('━'.repeat(80));
console.log('✓ nse.getData()                               - Generic data retrieval');
console.log('✓ nse.getDataByEndpoint(endpoint)             - Custom endpoint access');
console.log('');

console.log('\n' + '='.repeat(80));
console.log('METRIK YANG TERSEDIA:');
console.log('='.repeat(80));

const metrics = {
  'Price Data': [
    'Last Price',
    'Open Price',
    'High Price',
    'Low Price',
    'Close Price',
    'Previous Close',
    'VWAP (Volume Weighted Average Price)',
    '52 Week High/Low',
    'Intraday High/Low',
    'Upper/Lower Circuit Limits'
  ],
  'Volume & Turnover': [
    'Total Traded Volume',
    'Total Traded Value',
    'Total Trades Count',
    'Delivery Quantity',
    'Delivery Percentage'
  ],
  'Market Cap & Ratios': [
    'Market Capitalization',
    'P/E Ratio (Price to Earnings)',
    'P/B Ratio (Price to Book)',
    'Dividend Yield',
    'EPS (Earnings Per Share)',
    'Face Value',
    'Book Value'
  ],
  'Change & Movement': [
    'Absolute Change',
    'Percentage Change',
    '30 Days % Change',
    '365 Days % Change',
    'Weekly Change',
    'Monthly Change'
  ],
  'Index Data': [
    'Index Value',
    'Index Change',
    'Advances Count',
    'Declines Count',
    'Unchanged Count',
    'Index PE Ratio',
    'Index PB Ratio'
  ],
  'Options Data': [
    'Strike Price',
    'Call/Put Prices',
    'Open Interest',
    'Change in OI',
    'Implied Volatility',
    'Greeks (Delta, Gamma, Vega, Theta)',
    'Bid/Ask Prices',
    'Expiry Dates'
  ],
  'Corporate Actions': [
    'Dividend Announcements',
    'Bonus Issues',
    'Stock Splits',
    'Rights Issues',
    'Ex-Dates',
    'Record Dates'
  ],
  'Company Info': [
    'Company Name',
    'Symbol',
    'ISIN',
    'Industry',
    'Sector',
    'Series',
    'Listing Date',
    'Issued Size (Shares)'
  ],
  'Historical Data': [
    'Daily OHLCV',
    'Date Range Data',
    'Historical Volume',
    'Historical Turnover',
    'Delivery Data History'
  ]
};

Object.keys(metrics).forEach(category => {
  console.log(`\n📌 ${category.toUpperCase()}:`);
  metrics[category].forEach(metric => {
    console.log(`   ✓ ${metric}`);
  });
});

console.log('\n' + '='.repeat(80));
console.log('CONTOH PENGGUNAAN LENGKAP:');
console.log('='.repeat(80));

async function demonstrateAllMethods() {
  try {
    console.log('\n1. EQUITY TRADE INFO (Detail Trading):');
    console.log('   const tradeInfo = await nse.getEquityTradeInfo("RELIANCE");');
    console.log('   Output: Block deals, bulk deals, delivery data, dll\n');

    console.log('2. OPTIONS CHAIN (Equity):');
    console.log('   const options = await nse.getEquityOptionChain("NIFTY");');
    console.log('   Output: Strike prices, OI, Greeks, call/put data\n');

    console.log('3. INDEX OPTIONS:');
    console.log('   const indexOptions = await nse.getIndexOptionChain("NIFTY");');
    console.log('   Output: Index options data\n');

    console.log('4. COMMODITY OPTIONS:');
    console.log('   const commodityOpt = await nse.getCommodityOptionChain("GOLD");');
    console.log('   Output: Commodity derivatives data\n');

    console.log('5. GAINERS/LOSERS BY INDEX:');
    console.log('   const movers = await nse.getGainersAndLosersByIndex("NIFTY 50");');
    console.log('   Output: Top gainers & losers dalam index tertentu\n');

    console.log('6. MOST ACTIVE EQUITIES:');
    console.log('   const active = await nse.getMostActiveEquities();');
    console.log('   Output: Saham paling aktif diperdagangkan\n');

    console.log('7. CUSTOM ENDPOINT:');
    console.log('   const data = await nse.getDataByEndpoint("/api/custom-endpoint");');
    console.log('   Output: Data dari endpoint NSE apapun\n');

  } catch (error) {
    console.error('Demo error:', error.message);
  }
}

console.log('\n' + '='.repeat(80));
console.log('KETERBATASAN API:');
console.log('='.repeat(80));

console.log(`
❌ TIDAK TERSEDIA:
   - Level 2 Market Depth (Full order book)
   - Tick-by-tick data
   - Real-time streaming data (hanya polling)
   - Fundamental data detail (balance sheet, P&L, cash flow)
   - Analyst ratings & recommendations
   - News & sentiment data
   - Screener berdasarkan multiple criteria
   - Backtesting capabilities
   - FII/DII data detail
   - Pledged shares data
   - Insider trading details
   - Mutual fund holdings

✓ TERSEDIA:
   - Real-time quotes (via polling)
   - Historical OHLCV data
   - Basic company info
   - Market movers (gainers/losers)
   - Index data
   - Options chain
   - Basic corporate actions
   - Trading statistics

⚠️  CATATAN PENTING:
   - Ini adalah unofficial API (screen scraping dari NSE website)
   - Dapat terkena rate limiting atau blocking (error 403)
   - Tidak cocok untuk high-frequency trading
   - Data delay bisa terjadi saat jam trading ramai
   - Tidak ada official support dari NSE
   - Structure data bisa berubah jika NSE update website
`);

console.log('='.repeat(80));
console.log('\n💡 REKOMENDASI:');
console.log(`
Untuk data yang lebih lengkap, pertimbangkan:

1. Official NSE Data Feed (berbayar):
   - Real-time tick data
   - Full market depth
   - Guaranteed uptime & support

2. Third-party Data Providers:
   - AlphaVantage (free tier available)
   - Yahoo Finance API
   - Zerodha Kite Connect (for trading)
   - Upstox API
   - 5Paisa API

3. Kombinasi dengan Web Scraping:
   - Screener.in untuk fundamental data
   - MoneyControl untuk news
   - TradingView for technical analysis
`);

console.log('='.repeat(80));
console.log('✓ Dokumentasi lengkap selesai!\n');
