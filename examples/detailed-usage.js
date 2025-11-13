/**
 * Detailed Usage Example - Stock NSE India API
 *
 * Contoh penggunaan lanjutan API untuk analisis saham lebih detail
 */

import {
  getEquityDetails,
  getEquityHistoricalData,
  getEquityCorporateInfo,
  getIndexList,
  getIndexDetails,
  getTopGainers,
  getTopLosers,
  getTopTurnoverByValue
} from 'stock-nse-india';

async function detailedExample() {
  try {
    console.log('=== CONTOH PENGGUNAAN LANJUTAN STOCK NSE INDIA API ===\n');

    // 1. Mendapatkan Top Gainers (Saham dengan kenaikan tertinggi)
    console.log('1. Top Gainers hari ini...');
    const gainers = await getTopGainers();
    console.log('Top 5 Gainers:');
    gainers.slice(0, 5).forEach((stock, index) => {
      console.log(`${index + 1}. ${stock.symbol} - ${stock.lastPrice} (${stock.pChange > 0 ? '+' : ''}${stock.pChange}%)`);
    });
    console.log('\n---\n');

    // 2. Mendapatkan Top Losers (Saham dengan penurunan tertinggi)
    console.log('2. Top Losers hari ini...');
    const losers = await getTopLosers();
    console.log('Top 5 Losers:');
    losers.slice(0, 5).forEach((stock, index) => {
      console.log(`${index + 1}. ${stock.symbol} - ${stock.lastPrice} (${stock.pChange}%)`);
    });
    console.log('\n---\n');

    // 3. Mendapatkan saham dengan volume trading tertinggi
    console.log('3. Saham dengan nilai transaksi tertinggi...');
    const topTurnover = await getTopTurnoverByValue();
    console.log('Top 5 by Turnover:');
    topTurnover.slice(0, 5).forEach((stock, index) => {
      console.log(`${index + 1}. ${stock.symbol} - Volume: ${stock.totalTradedVolume.toLocaleString()}`);
    });
    console.log('\n---\n');

    // 4. Analisis detail saham tertentu
    console.log('4. Analisis detail saham TCS...');
    const tcsDetails = await getEquityDetails('TCS');
    console.log('Informasi Detail TCS:');
    console.log({
      nama: tcsDetails.info?.companyName,
      hargaTerakhir: tcsDetails.priceInfo?.lastPrice,
      perubahan: `${tcsDetails.priceInfo?.change} (${tcsDetails.priceInfo?.pChange}%)`,
      high52Week: tcsDetails.priceInfo?.['52WeekHighLow']?.max,
      low52Week: tcsDetails.priceInfo?.['52WeekHighLow']?.min,
      marketCap: tcsDetails.metadata?.marketCap,
      pe: tcsDetails.metadata?.pdSectorPe,
      industry: tcsDetails.metadata?.industry
    });
    console.log('\n---\n');

    // 5. Data Historical dengan rentang waktu berbeda
    console.log('5. Perbandingan data historical (1 minggu vs 1 bulan)...');
    const data1Week = await getEquityHistoricalData('TCS', '1W');
    const data1Month = await getEquityHistoricalData('TCS', '1M');
    console.log(`Data 1 minggu: ${data1Week.length} hari`);
    console.log(`Data 1 bulan: ${data1Month.length} hari`);

    if (data1Week.length > 0) {
      const firstDay = data1Week[data1Week.length - 1];
      const lastDay = data1Week[0];
      const weeklyChange = ((lastDay.CH_CLOSING_PRICE - firstDay.CH_CLOSING_PRICE) / firstDay.CH_CLOSING_PRICE * 100).toFixed(2);
      console.log(`Perubahan 1 minggu: ${weeklyChange}%`);
    }
    console.log('\n---\n');

    // 6. Informasi Corporate Actions
    console.log('6. Informasi corporate actions INFY...');
    const infyCorporate = await getEquityCorporateInfo('INFY');
    console.log('Corporate Info INFY:');
    console.log({
      symbol: infyCorporate.symbol,
      series: infyCorporate.series,
      jumlahActions: infyCorporate.corporate?.length || 0
    });
    if (infyCorporate.corporate && infyCorporate.corporate.length > 0) {
      console.log('Action terbaru:', infyCorporate.corporate[0]);
    }
    console.log('\n---\n');

    // 7. Informasi Index (Nifty 50)
    console.log('7. Mendapatkan semua index...');
    const indices = await getIndexList();
    console.log(`Total index tersedia: ${indices.length}`);
    console.log('Contoh index:', indices.slice(0, 5).map(idx => idx.indexName));
    console.log('\n---\n');

    // 8. Detail Index Nifty 50
    console.log('8. Detail index NIFTY 50...');
    const nifty50 = await getIndexDetails('NIFTY 50');
    console.log('NIFTY 50 Details:');
    console.log({
      name: nifty50.name,
      lastPrice: nifty50.last,
      change: nifty50.change,
      pChange: nifty50.pChange,
      open: nifty50.open,
      high: nifty50.high,
      low: nifty50.low,
      yearHigh: nifty50.yearHigh,
      yearLow: nifty50.yearLow
    });

    console.log('\n=== SELESAI ===');

  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Jalankan contoh
detailedExample();
