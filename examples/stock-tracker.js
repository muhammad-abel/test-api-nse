/**
 * Stock Tracker Example
 *
 * Contoh aplikasi sederhana untuk tracking beberapa saham favorit
 */

import {
  getEquityDetails,
  getEquityHistoricalData
} from 'stock-nse-india';

// Daftar saham yang akan di-track
const WATCHLIST = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK'];

/**
 * Fungsi untuk mendapatkan ringkasan saham
 */
async function getStockSummary(symbol) {
  try {
    const details = await getEquityDetails(symbol);
    const historical = await getEquityHistoricalData(symbol, '1W');

    // Hitung perubahan mingguan
    let weeklyChange = 0;
    if (historical.length >= 2) {
      const firstDay = historical[historical.length - 1];
      const lastDay = historical[0];
      weeklyChange = ((lastDay.CH_CLOSING_PRICE - firstDay.CH_CLOSING_PRICE) / firstDay.CH_CLOSING_PRICE * 100);
    }

    return {
      symbol: details.info?.symbol,
      companyName: details.info?.companyName,
      lastPrice: details.priceInfo?.lastPrice,
      change: details.priceInfo?.change,
      pChange: details.priceInfo?.pChange,
      dayHigh: details.priceInfo?.intraDayHighLow?.max,
      dayLow: details.priceInfo?.intraDayHighLow?.min,
      weeklyChange: weeklyChange.toFixed(2),
      volume: details.preOpenMarket?.totalTradedVolume || 0,
      yearHigh: details.priceInfo?.['52WeekHighLow']?.max,
      yearLow: details.priceInfo?.['52WeekHighLow']?.min,
      pe: details.metadata?.pdSectorPe
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error.message);
    return null;
  }
}

/**
 * Fungsi untuk menampilkan portfolio watchlist
 */
async function trackWatchlist() {
  console.log('╔════════════════════════════════════════════════════════════════════════╗');
  console.log('║                      STOCK TRACKER - WATCHLIST                         ║');
  console.log('╚════════════════════════════════════════════════════════════════════════╝\n');

  console.log(`Tracking ${WATCHLIST.length} saham...\n`);

  const summaries = [];

  // Fetch data untuk semua saham di watchlist
  for (const symbol of WATCHLIST) {
    console.log(`Fetching ${symbol}...`);
    const summary = await getStockSummary(symbol);
    if (summary) {
      summaries.push(summary);
    }
    // Delay untuk menghindari rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(80) + '\n');

  // Tampilkan hasil
  summaries.forEach((stock, index) => {
    const changeIndicator = stock.pChange >= 0 ? '↑' : '↓';
    const weeklyIndicator = stock.weeklyChange >= 0 ? '↑' : '↓';

    console.log(`${index + 1}. ${stock.symbol} - ${stock.companyName}`);
    console.log(`   Harga: ₹${stock.lastPrice} ${changeIndicator} ${stock.change} (${stock.pChange}%)`);
    console.log(`   Hari ini: L ${stock.dayLow} - H ${stock.dayHigh}`);
    console.log(`   Perubahan Mingguan: ${weeklyIndicator} ${stock.weeklyChange}%`);
    console.log(`   52W Range: ₹${stock.yearLow} - ₹${stock.yearHigh}`);
    console.log(`   P/E Ratio: ${stock.pe || 'N/A'}`);
    console.log('   ' + '-'.repeat(76));
  });

  // Analisis sederhana
  console.log('\n📊 ANALISIS WATCHLIST:\n');

  const gainers = summaries.filter(s => s.pChange > 0);
  const losers = summaries.filter(s => s.pChange < 0);

  console.log(`   Gainers: ${gainers.length} saham`);
  console.log(`   Losers: ${losers.length} saham`);
  console.log(`   Flat: ${summaries.length - gainers.length - losers.length} saham`);

  if (gainers.length > 0) {
    const bestGainer = gainers.reduce((max, s) => s.pChange > max.pChange ? s : max);
    console.log(`   Best Performer: ${bestGainer.symbol} (+${bestGainer.pChange}%)`);
  }

  if (losers.length > 0) {
    const worstLoser = losers.reduce((min, s) => s.pChange < min.pChange ? s : min);
    console.log(`   Worst Performer: ${worstLoser.symbol} (${worstLoser.pChange}%)`);
  }

  console.log('\n' + '='.repeat(80));
  console.log('✓ Tracking selesai');
}

// Jalankan tracker
trackWatchlist().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
