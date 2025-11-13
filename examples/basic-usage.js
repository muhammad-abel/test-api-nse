/**
 * Basic Usage Example - Stock NSE India API
 *
 * Contoh dasar penggunaan API untuk mendapatkan data saham dari NSE India
 */

import stockNseIndia from 'stock-nse-india';

const { NseIndia } = stockNseIndia;
const nse = new NseIndia();

async function basicExample() {
  try {
    console.log('=== CONTOH DASAR PENGGUNAAN STOCK NSE INDIA API ===\n');

    // 1. Mendapatkan semua symbol saham
    console.log('1. Mendapatkan daftar semua symbol saham...');
    const symbols = await nse.getAllStockSymbols();
    console.log(`Total saham tersedia: ${symbols.length}`);
    console.log('Contoh 10 saham pertama:', symbols.slice(0, 10));
    console.log('\n---\n');

    // 2. Mendapatkan detail saham tertentu (contoh: RELIANCE)
    console.log('2. Mendapatkan detail saham RELIANCE...');
    const relianceDetails = await nse.getEquityDetails('RELIANCE');
    console.log('Detail RELIANCE:');
    console.log({
      symbol: relianceDetails.info?.symbol,
      companyName: relianceDetails.info?.companyName,
      lastPrice: relianceDetails.priceInfo?.lastPrice,
      change: relianceDetails.priceInfo?.change,
      pChange: relianceDetails.priceInfo?.pChange,
      dayHigh: relianceDetails.priceInfo?.intraDayHighLow?.max,
      dayLow: relianceDetails.priceInfo?.intraDayHighLow?.min,
      yearHigh: relianceDetails.priceInfo?.['52WeekHighLow']?.max,
      yearLow: relianceDetails.priceInfo?.['52WeekHighLow']?.min
    });
    console.log('\n---\n');

    // 3. Mendapatkan data historical (range waktu)
    console.log('3. Mendapatkan data historical RELIANCE (1 bulan)...');
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1); // 1 bulan lalu

    const historicalData = await nse.getEquityHistoricalData('RELIANCE', {
      start: startDate,
      end: endDate
    });
    console.log(`Data historical tersedia: ${historicalData.length} hari`);
    if (historicalData.length > 0) {
      console.log('Data terbaru:', {
        date: historicalData[0].CH_TIMESTAMP,
        open: historicalData[0].CH_OPENING_PRICE,
        high: historicalData[0].CH_TRADE_HIGH_PRICE,
        low: historicalData[0].CH_TRADE_LOW_PRICE,
        close: historicalData[0].CH_CLOSING_PRICE,
        volume: historicalData[0].CH_TOT_TRADED_QTY
      });
    }
    console.log('\n---\n');

    // 4. Mendapatkan data intraday
    console.log('4. Mendapatkan data intraday RELIANCE...');
    const intradayData = await nse.getEquityIntradayData('RELIANCE');
    console.log('Data intraday:', {
      identifier: intradayData.identifier,
      lastPrice: intradayData.lastPrice,
      totalTradedVolume: intradayData.totalTradedVolume,
      totalTradedValue: intradayData.totalTradedValue,
      lastUpdateTime: intradayData.lastUpdateTime
    });

    console.log('\n=== SELESAI ===');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Jalankan contoh
basicExample();
