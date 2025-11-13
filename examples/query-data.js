/**
 * Query Data Examples - MongoDB
 *
 * Contoh query untuk mengakses data yang sudah di-scrape
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Equity from '../src/models/Equity.js';
import HistoricalData from '../src/models/HistoricalData.js';
import Index from '../src/models/Index.js';
import MarketMovers from '../src/models/MarketMovers.js';
import CorporateAction from '../src/models/CorporateAction.js';

dotenv.config();

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nse_stock_data';
  await mongoose.connect(uri);
  console.log('✓ Connected to MongoDB\n');
}

async function queryExamples() {
  try {
    await connectDB();

    console.log('=== CONTOH QUERY DATA DARI MONGODB ===\n');

    // 1. Get Latest Price untuk Symbol
    console.log('1. LATEST PRICE untuk RELIANCE:');
    console.log('-'.repeat(80));
    const latestPrice = await Equity.findOne({ symbol: 'RELIANCE' })
      .sort({ scrapedAt: -1 })
      .select('symbol lastPrice change pChange yearHigh yearLow marketCap scrapedAt');

    if (latestPrice) {
      console.log({
        symbol: latestPrice.symbol,
        price: latestPrice.lastPrice,
        change: `${latestPrice.change} (${latestPrice.pChange}%)`,
        '52W High': latestPrice.yearHigh,
        '52W Low': latestPrice.yearLow,
        marketCap: latestPrice.marketCap,
        timestamp: latestPrice.scrapedAt
      });
    } else {
      console.log('No data found. Run scraper first: npm run scraper:once');
    }
    console.log('\n');

    // 2. Get Historical Data (Last 7 days)
    console.log('2. HISTORICAL DATA (Last 7 days) untuk TCS:');
    console.log('-'.repeat(80));
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const historical = await HistoricalData.find({
      symbol: 'TCS',
      date: { $gte: sevenDaysAgo }
    })
      .sort({ date: -1 })
      .select('date open high low close totalTradedVolume')
      .limit(7);

    if (historical.length > 0) {
      historical.forEach(record => {
        console.log({
          date: record.date.toISOString().split('T')[0],
          open: record.open,
          high: record.high,
          low: record.low,
          close: record.close,
          volume: record.totalTradedVolume
        });
      });
    } else {
      console.log('No historical data found. Run scraper first.');
    }
    console.log('\n');

    // 3. Get All Symbols in Database
    console.log('3. ALL SYMBOLS in Database:');
    console.log('-'.repeat(80));
    const symbols = await Equity.distinct('symbol');
    console.log(`Total symbols: ${symbols.length}`);
    console.log('Symbols:', symbols.slice(0, 20).join(', '));
    console.log('\n');

    // 4. Get Latest Index Values
    console.log('4. LATEST INDEX VALUES:');
    console.log('-'.repeat(80));
    const indices = await Index.aggregate([
      { $sort: { scrapedAt: -1 } },
      {
        $group: {
          _id: '$name',
          lastDoc: { $first: '$$ROOT' }
        }
      },
      { $replaceRoot: { newRoot: '$lastDoc' } },
      { $sort: { name: 1 } }
    ]);

    if (indices.length > 0) {
      indices.forEach(idx => {
        console.log({
          name: idx.name,
          value: idx.last,
          change: `${idx.change} (${idx.pChange}%)`,
          advances: idx.advances,
          declines: idx.declines
        });
      });
    } else {
      console.log('No index data found.');
    }
    console.log('\n');

    // 5. Get Today's Top Gainers
    console.log('5. TODAY\'S TOP GAINERS:');
    console.log('-'.repeat(80));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const gainers = await MarketMovers.find({
      type: 'gainer',
      date: { $gte: today }
    })
      .sort({ rank: 1 })
      .limit(5);

    if (gainers.length > 0) {
      gainers.forEach((stock, i) => {
        console.log(`${i + 1}. ${stock.symbol}: ₹${stock.lastPrice} (${stock.pChange > 0 ? '+' : ''}${stock.pChange}%)`);
      });
    } else {
      console.log('No market movers data found.');
    }
    console.log('\n');

    // 6. Get Upcoming Corporate Actions
    console.log('6. UPCOMING CORPORATE ACTIONS:');
    console.log('-'.repeat(80));
    const upcomingActions = await CorporateAction.find({
      exDate: { $gte: new Date() }
    })
      .sort({ exDate: 1 })
      .limit(5);

    if (upcomingActions.length > 0) {
      upcomingActions.forEach(action => {
        console.log({
          symbol: action.symbol,
          purpose: action.purpose,
          exDate: action.exDate?.toISOString().split('T')[0],
          recordDate: action.recordDate?.toISOString().split('T')[0]
        });
      });
    } else {
      console.log('No upcoming corporate actions found.');
    }
    console.log('\n');

    // 7. Price Movement Analysis (7 days)
    console.log('7. PRICE MOVEMENT ANALYSIS (RELIANCE - 7 days):');
    console.log('-'.repeat(80));
    const priceMovement = await Equity.aggregate([
      {
        $match: {
          symbol: 'RELIANCE',
          scrapedAt: { $gte: sevenDaysAgo }
        }
      },
      { $sort: { scrapedAt: 1 } },
      {
        $group: {
          _id: '$symbol',
          firstPrice: { $first: '$lastPrice' },
          lastPrice: { $last: '$lastPrice' },
          avgPrice: { $avg: '$lastPrice' },
          minPrice: { $min: '$lastPrice' },
          maxPrice: { $max: '$lastPrice' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          symbol: '$_id',
          firstPrice: 1,
          lastPrice: 1,
          avgPrice: { $round: ['$avgPrice', 2] },
          minPrice: 1,
          maxPrice: 1,
          priceChange: { $round: [{ $subtract: ['$lastPrice', '$firstPrice'] }, 2] },
          priceChangePct: {
            $round: [{
              $multiply: [
                { $divide: [{ $subtract: ['$lastPrice', '$firstPrice'] }, '$firstPrice'] },
                100
              ]
            }, 2]
          },
          volatility: { $round: [{ $subtract: ['$maxPrice', '$minPrice'] }, 2] },
          dataPoints: '$count'
        }
      }
    ]);

    if (priceMovement.length > 0) {
      console.log(priceMovement[0]);
    } else {
      console.log('Not enough data for analysis.');
    }
    console.log('\n');

    // 8. Database Statistics
    console.log('8. DATABASE STATISTICS:');
    console.log('-'.repeat(80));
    const stats = {
      equityRecords: await Equity.countDocuments(),
      historicalRecords: await HistoricalData.countDocuments(),
      indexRecords: await Index.countDocuments(),
      marketMoversRecords: await MarketMovers.countDocuments(),
      corporateActionsRecords: await CorporateAction.countDocuments(),
      uniqueSymbols: symbols.length,
      uniqueIndices: await Index.distinct('name').then(arr => arr.length)
    };

    console.log(stats);
    console.log('\n');

    console.log('='.repeat(80));
    console.log('✓ Query examples completed!');
    console.log('\nTips:');
    console.log('  - Run "npm run scraper:once" to populate data');
    console.log('  - Use mongosh for advanced queries');
    console.log('  - Check SCRAPER_README.md for more examples');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✓ Disconnected from MongoDB');
  }
}

// Run queries
queryExamples();
