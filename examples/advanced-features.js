/**
 * Advanced Features Example - Method Tambahan
 *
 * Contoh penggunaan method-method advanced yang belum dicover di example sebelumnya
 */

import stockNseIndia from 'stock-nse-india';

const { NseIndia } = stockNseIndia;
const nse = new NseIndia();

async function advancedFeaturesDemo() {
  try {
    console.log('=== FITUR ADVANCED STOCK NSE INDIA API ===\n');

    // 1. Equity Trade Info
    console.log('1. EQUITY TRADE INFO - Trading Statistics Detail');
    console.log('-'.repeat(80));
    try {
      const tradeInfo = await nse.getEquityTradeInfo('RELIANCE');
      console.log('Trade Info RELIANCE:');
      console.log({
        symbol: tradeInfo.symbol || 'RELIANCE',
        securityInfo: tradeInfo.securityInfo,
        deliveryQuantity: tradeInfo.deliveryToTradedQuantity?.deliveryQty,
        deliveryPercent: tradeInfo.deliveryToTradedQuantity?.deliveryPercent,
        marketDeptOrderBook: tradeInfo.marketDeptOrderBook ? 'Available' : 'Not Available',
        preBid: tradeInfo.preBid ? 'Available' : 'Not Available'
      });
    } catch (error) {
      console.log('Error:', error.message);
      console.log('Note: Method ini memberikan data trading detail seperti delivery, block deals, etc.');
    }
    console.log('\n---\n');

    // 2. Options Chain
    console.log('2. EQUITY OPTIONS CHAIN');
    console.log('-'.repeat(80));
    try {
      const optionsChain = await nse.getEquityOptionChain('RELIANCE');
      console.log('Options Chain RELIANCE:');
      if (optionsChain.records && optionsChain.records.data) {
        const firstOption = optionsChain.records.data[0];
        console.log('Contoh Strike:', {
          strikePrice: firstOption.strikePrice,
          expiryDate: firstOption.expiryDate,
          callOI: firstOption.CE?.openInterest,
          putOI: firstOption.PE?.openInterest,
          callLTP: firstOption.CE?.lastPrice,
          putLTP: firstOption.PE?.lastPrice
        });
        console.log(`Total strikes available: ${optionsChain.records.data.length}`);
      }
    } catch (error) {
      console.log('Error:', error.message);
      console.log('Note: Options chain memberikan data strike prices, OI, Greeks, dll');
    }
    console.log('\n---\n');

    // 3. Index Options Chain
    console.log('3. INDEX OPTIONS CHAIN (NIFTY)');
    console.log('-'.repeat(80));
    try {
      const indexOptions = await nse.getIndexOptionChain('NIFTY');
      console.log('Index Options NIFTY:');
      if (indexOptions.records && indexOptions.records.data) {
        const strikes = indexOptions.records.data.slice(0, 3);
        console.log(`ATM Strikes (3 contoh):`);
        strikes.forEach(s => {
          console.log(`  Strike ${s.strikePrice}: Call OI=${s.CE?.openInterest || 0}, Put OI=${s.PE?.openInterest || 0}`);
        });
        console.log(`Total strikes: ${indexOptions.records.data.length}`);
      }
    } catch (error) {
      console.log('Error:', error.message);
      console.log('Note: Index options untuk NIFTY, BANKNIFTY, dll');
    }
    console.log('\n---\n');

    // 4. Index Intraday Data
    console.log('4. INDEX INTRADAY DATA');
    console.log('-'.repeat(80));
    try {
      const indexIntraday = await nse.getIndexIntradayData('NIFTY 50');
      console.log('Intraday NIFTY 50:');
      console.log({
        name: indexIntraday.name,
        last: indexIntraday.last,
        change: indexIntraday.change,
        pChange: indexIntraday.pChange,
        open: indexIntraday.open,
        high: indexIntraday.high,
        low: indexIntraday.low,
        previousClose: indexIntraday.previousClose
      });

      if (indexIntraday.data && indexIntraday.data.length > 0) {
        console.log(`\nData points available: ${indexIntraday.data.length}`);
        console.log('Latest data point:', indexIntraday.data[indexIntraday.data.length - 1]);
      }
    } catch (error) {
      console.log('Error:', error.message);
      console.log('Note: Data pergerakan index secara intraday');
    }
    console.log('\n---\n');

    // 5. Gainers & Losers by Index
    console.log('5. GAINERS & LOSERS BY INDEX (NIFTY 50)');
    console.log('-'.repeat(80));
    try {
      const movers = await nse.getGainersAndLosersByIndex('NIFTY 50');
      console.log('Market Movers in NIFTY 50:');

      if (movers.advance && movers.advance.declines) {
        console.log(`\nTop 3 Gainers in NIFTY 50:`);
        const topGainers = movers.advance.declines.slice(0, 3);
        topGainers.forEach((stock, i) => {
          console.log(`  ${i+1}. ${stock.symbol}: ${stock.pChange}%`);
        });
      }

      if (movers.decline && movers.decline.declines) {
        console.log(`\nTop 3 Losers in NIFTY 50:`);
        const topLosers = movers.decline.declines.slice(0, 3);
        topLosers.forEach((stock, i) => {
          console.log(`  ${i+1}. ${stock.symbol}: ${stock.pChange}%`);
        });
      }
    } catch (error) {
      console.log('Error:', error.message);
      console.log('Note: Gainers & losers specific untuk index tertentu');
    }
    console.log('\n---\n');

    // 6. Most Active Equities
    console.log('6. MOST ACTIVE EQUITIES');
    console.log('-'.repeat(80));
    try {
      const active = await nse.getMostActiveEquities();
      console.log('Most Active Stocks:');

      if (active.value && active.value.length > 0) {
        console.log('\nBy Value (Top 5):');
        active.value.slice(0, 5).forEach((stock, i) => {
          console.log(`  ${i+1}. ${stock.symbol}: Volume=${stock.totalTradedVolume.toLocaleString()}`);
        });
      }

      if (active.volume && active.volume.length > 0) {
        console.log('\nBy Volume (Top 5):');
        active.volume.slice(0, 5).forEach((stock, i) => {
          console.log(`  ${i+1}. ${stock.symbol}: Volume=${stock.totalTradedVolume.toLocaleString()}`);
        });
      }
    } catch (error) {
      console.log('Error:', error.message);
      console.log('Note: Saham paling aktif berdasarkan value dan volume');
    }
    console.log('\n---\n');

    // 7. Commodity Options (jika tersedia)
    console.log('7. COMMODITY OPTIONS CHAIN');
    console.log('-'.repeat(80));
    try {
      // Contoh commodity yang mungkin tersedia
      const commodity = await nse.getCommodityOptionChain('GOLD');
      console.log('Commodity Options:');
      console.log(commodity);
    } catch (error) {
      console.log('Error:', error.message);
      console.log('Note: Options chain untuk commodity derivatives');
    }
    console.log('\n---\n');

    console.log('='.repeat(80));
    console.log('✓ Demo advanced features selesai!');
    console.log('='.repeat(80));

    console.log('\n📝 RINGKASAN METHOD ADVANCED:');
    console.log(`
    ✓ getEquityTradeInfo()           - Delivery data, block/bulk deals
    ✓ getEquityOptionChain()         - Options data untuk equity
    ✓ getIndexOptionChain()          - Options data untuk index
    ✓ getIndexIntradayData()         - Pergerakan index intraday
    ✓ getGainersAndLosersByIndex()   - Movers dalam index tertentu
    ✓ getMostActiveEquities()        - Most active by value/volume
    ✓ getCommodityOptionChain()      - Commodity derivatives
    `);

  } catch (error) {
    console.error('Main Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Jalankan demo
console.log('⚠️  CATATAN:');
console.log('Beberapa method mungkin return error 403 atau data tidak tersedia');
console.log('tergantung pada pembatasan NSE API dan jam trading.\n');

advancedFeaturesDemo();
