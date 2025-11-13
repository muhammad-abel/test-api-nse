/**
 * NSE Data Scraper Service
 */

import stockNseIndia from 'stock-nse-india';
import Equity from '../models/Equity.js';
import HistoricalData from '../models/HistoricalData.js';
import Index from '../models/Index.js';
import MarketMovers from '../models/MarketMovers.js';
import CorporateAction from '../models/CorporateAction.js';
import logger from '../utils/logger.js';

const { NseIndia } = stockNseIndia;

class NseScraper {
  constructor(config = {}) {
    this.nse = new NseIndia();
    this.config = {
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 2000,
      requestDelay: config.requestDelay || 1000,
      ...config
    };
    this.stats = {
      success: 0,
      failed: 0,
      total: 0
    };
  }

  // Utility: Sleep function
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Utility: Parse date from various formats
  parseDate(dateStr) {
    if (!dateStr) return null;

    try {
      // Try ISO format first
      let parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }

      // Try DD-MMM-YYYY format (e.g., "13-Nov-2024")
      const ddMmmYyyy = dateStr.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
      if (ddMmmYyyy) {
        const [, day, month, year] = ddMmmYyyy;
        const monthMap = {
          'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
          'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        return new Date(parseInt(year), monthMap[month], parseInt(day));
      }

      // Try other common formats
      return new Date(dateStr);
    } catch (error) {
      logger.warn(`Failed to parse date: ${dateStr}`);
      return null;
    }
  }

  // Utility: Retry wrapper
  async retryOperation(operation, operationName, retries = this.config.maxRetries) {
    for (let i = 0; i < retries; i++) {
      try {
        const result = await operation();
        return result;
      } catch (error) {
        logger.warn(`${operationName} failed (attempt ${i + 1}/${retries}):`, error.message);
        if (i < retries - 1) {
          await this.sleep(this.config.retryDelay * (i + 1));
        } else {
          throw error;
        }
      }
    }
  }

  // 1. Scrape Equity Details
  async scrapeEquityDetails(symbol) {
    try {
      logger.info(`Scraping equity details for ${symbol}...`);

      const data = await this.retryOperation(
        () => this.nse.getEquityDetails(symbol),
        `getEquityDetails(${symbol})`
      );

      const equityDoc = {
        symbol: symbol,
        companyName: data.info?.companyName,
        industry: data.info?.industry || data.metadata?.industry,
        sector: data.metadata?.sector,
        isin: data.info?.isin || data.metadata?.isin,
        series: data.metadata?.series,

        lastPrice: data.priceInfo?.lastPrice,
        open: data.priceInfo?.open,
        high: data.priceInfo?.intraDayHighLow?.max,
        low: data.priceInfo?.intraDayHighLow?.min,
        close: data.priceInfo?.close,
        previousClose: data.priceInfo?.previousClose,
        vwap: data.priceInfo?.vwap,

        change: data.priceInfo?.change,
        pChange: data.priceInfo?.pChange,

        yearHigh: data.priceInfo?.['52WeekHighLow']?.max || data.priceInfo?.weekHighLow?.max,
        yearLow: data.priceInfo?.['52WeekHighLow']?.min || data.priceInfo?.weekHighLow?.min,

        intraDayHigh: data.priceInfo?.intraDayHighLow?.max,
        intraDayLow: data.priceInfo?.intraDayHighLow?.min,

        upperCircuitLimit: parseFloat(data.priceInfo?.upperCP),
        lowerCircuitLimit: parseFloat(data.priceInfo?.lowerCP),

        totalTradedVolume: data.preOpenMarket?.totalTradedVolume,
        totalTradedValue: data.preOpenMarket?.totalTradedValue,

        marketCap: data.metadata?.marketCap,
        peRatio: data.metadata?.pdSectorPe,
        faceValue: data.securityInfo?.faceValue,

        listingDate: data.metadata?.listingDate ? new Date(data.metadata.listingDate) : null,
        issuedSize: data.securityInfo?.issuedSize,

        lastUpdateTime: data.metadata?.lastUpdateTime ? new Date(data.metadata.lastUpdateTime) : null,
        scrapedAt: new Date()
      };

      // Save to database
      const saved = await Equity.create(equityDoc);
      logger.success(`Saved equity data for ${symbol}`);

      this.stats.success++;
      await this.sleep(this.config.requestDelay);

      return saved;

    } catch (error) {
      logger.error(`Failed to scrape equity ${symbol}:`, error.message);
      this.stats.failed++;
      return null;
    }
  }

  // 2. Scrape Historical Data
  async scrapeHistoricalData(symbol, days = 30) {
    try {
      logger.info(`Scraping historical data for ${symbol} (${days} days)...`);

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const response = await this.retryOperation(
        () => this.nse.getEquityHistoricalData(symbol, { start: startDate, end: endDate }),
        `getEquityHistoricalData(${symbol})`
      );

      // Handle response structure: could be array or {data: [...], meta: {...}}
      let data = response;
      if (response && response.data && Array.isArray(response.data)) {
        data = response.data;
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        logger.warn(`No historical data found for ${symbol}`);
        return [];
      }

      const savedDocs = [];

      for (const record of data) {
        try {
          // Try multiple date field names (API response structure varies)
          const dateStr = record.CH_TIMESTAMP || record.TIMESTAMP || record.mTIMESTAMP || record.date;

          const parsedDate = this.parseDate(dateStr);
          if (!parsedDate) {
            // Log first failed record for debugging
            if (savedDocs.length === 0) {
              logger.warn(`Skipping record - date field not found. Available fields: ${Object.keys(record).join(', ')}`);
            }
            continue;
          }

          const historicalDoc = {
            symbol: symbol,
            date: parsedDate,
            open: record.CH_OPENING_PRICE,
            high: record.CH_TRADE_HIGH_PRICE,
            low: record.CH_TRADE_LOW_PRICE,
            close: record.CH_CLOSING_PRICE,
            lastPrice: record.CH_LAST_TRADED_PRICE,
            previousClose: record.CH_PREVIOUS_CLS_PRICE,
            totalTradedVolume: record.CH_TOT_TRADED_QTY,
            totalTradedValue: record.CH_TOT_TRADED_VAL,
            totalTrades: record.CH_TOTAL_TRADES,
            week52High: record.CH_52WEEK_HIGH_PRICE,
            week52Low: record.CH_52WEEK_LOW_PRICE,
            vwap: record.VWAP,
            series: record.CH_SERIES,
            isin: record.CH_ISIN,
            scrapedAt: new Date()
          };

          // Use upsert to avoid duplicates
          const saved = await HistoricalData.findOneAndUpdate(
            { symbol: symbol, date: historicalDoc.date },
            historicalDoc,
            { upsert: true, new: true }
          );

          savedDocs.push(saved);

        } catch (error) {
          if (error.code !== 11000) { // Ignore duplicate key errors
            logger.error(`Error saving historical record:`, error.message);
          }
        }
      }

      logger.success(`Saved ${savedDocs.length} historical records for ${symbol}`);
      this.stats.success++;
      await this.sleep(this.config.requestDelay);

      return savedDocs;

    } catch (error) {
      const is403 = error.message && error.message.includes('403');
      if (is403) {
        logger.warn(`Historical data unavailable for ${symbol} (NSE API blocked - 403)`);
      } else {
        logger.error(`Failed to scrape historical data for ${symbol}:`, error.message);
      }
      this.stats.failed++;
      return [];
    }
  }

  // 3. Scrape Index Data
  async scrapeIndexDetails(indexName) {
    try {
      logger.info(`Scraping index details for ${indexName}...`);

      // Use getAllIndices instead of getEquityStockIndices() without parameter
      // This fixes the library bug where getEquityStockIndices() expects a parameter
      const allIndices = await this.retryOperation(
        () => this.nse.getAllIndices(),
        `getAllIndices()`
      );

      if (!allIndices || !allIndices.data) {
        logger.warn(`No index data available`);
        return null;
      }

      // Find the specific index (try multiple field names)
      const indexData = allIndices.data.find(idx => {
        const idxName = idx.index || idx.indexSymbol || idx.key || '';
        return idxName.toUpperCase() === indexName.toUpperCase();
      });

      if (!indexData) {
        logger.warn(`Index ${indexName} not found in data`);
        return null;
      }

      const indexDoc = {
        name: indexName,
        last: indexData.last,
        open: indexData.open,
        high: indexData.high,
        low: indexData.low,
        previousClose: indexData.previousClose,
        change: indexData.change,
        pChange: indexData.pChange,
        yearHigh: indexData.yearHigh,
        yearLow: indexData.yearLow,
        peRatio: indexData.pe,
        pbRatio: indexData.pb,
        dividendYield: indexData.dy,
        advances: indexData.advances,
        declines: indexData.declines,
        unchanged: indexData.unchanged,
        perChange30d: indexData.perChange30d,
        perChange365d: indexData.perChange365d,
        scrapedAt: new Date()
      };

      const saved = await Index.create(indexDoc);
      logger.success(`Saved index data for ${indexName}`);

      this.stats.success++;
      await this.sleep(this.config.requestDelay);

      return saved;

    } catch (error) {
      const is403 = error.message && error.message.includes('403');
      const isLibraryBug = error.message && error.message.includes('toUpperCase');

      if (is403) {
        logger.warn(`Index data unavailable for ${indexName} (NSE API blocked - 403)`);
      } else if (isLibraryBug) {
        logger.warn(`Index scraping not working (library bug) - Consider disabling ENABLE_INDEX_SCRAPING`);
      } else {
        logger.error(`Failed to scrape index ${indexName}:`, error.message);
      }
      this.stats.failed++;
      return null;
    }
  }

  // 4. Scrape Market Movers
  async scrapeMarketMovers() {
    try {
      logger.info('Scraping market movers...');

      // Get preopen market data which contains gainers/losers
      const preOpenData = await this.retryOperation(
        () => this.nse.getPreOpenMarketData(),
        'getPreOpenMarketData()'
      );

      if (!preOpenData || !preOpenData.data) {
        logger.warn('No preopen market data available');
        return;
      }

      // Sort by percentage change to get gainers and losers
      const sortedByChange = [...preOpenData.data].sort((a, b) => (b.pChange || 0) - (a.pChange || 0));

      // Top 10 gainers
      const gainers = sortedByChange.slice(0, 10);
      for (const [index, stock] of gainers.entries()) {
        if (stock.pChange > 0) {
          await MarketMovers.create({
            type: 'gainer',
            symbol: stock.symbol,
            lastPrice: stock.lastPrice,
            change: stock.change,
            pChange: stock.pChange,
            previousClose: stock.previousClose,
            open: stock.open,
            dayHigh: stock.dayHigh,
            dayLow: stock.dayLow,
            totalTradedVolume: stock.totalTradedVolume,
            totalTradedValue: stock.totalTradedValue,
            yearHigh: stock.yearHigh,
            yearLow: stock.yearLow,
            rank: index + 1,
            date: new Date()
          });
        }
      }

      // Top 10 losers
      const losers = sortedByChange.slice(-10).reverse();
      for (const [index, stock] of losers.entries()) {
        if (stock.pChange < 0) {
          await MarketMovers.create({
            type: 'loser',
            symbol: stock.symbol,
            lastPrice: stock.lastPrice,
            change: stock.change,
            pChange: stock.pChange,
            previousClose: stock.previousClose,
            open: stock.open,
            dayHigh: stock.dayHigh,
            dayLow: stock.dayLow,
            totalTradedVolume: stock.totalTradedVolume,
            totalTradedValue: stock.totalTradedValue,
            yearHigh: stock.yearHigh,
            yearLow: stock.yearLow,
            rank: index + 1,
            date: new Date()
          });
        }
      }

      logger.success(`Saved market movers (gainers: ${gainers.length}, losers: ${losers.length})`);
      this.stats.success++;
      await this.sleep(this.config.requestDelay);

    } catch (error) {
      logger.error('Failed to scrape market movers:', error.message);
      this.stats.failed++;
    }
  }

  // 5. Scrape Corporate Actions
  async scrapeCorporateActions(symbol) {
    try {
      logger.info(`Scraping corporate actions for ${symbol}...`);

      const data = await this.retryOperation(
        () => this.nse.getEquityCorporateInfo(symbol),
        `getEquityCorporateInfo(${symbol})`
      );

      if (!data.corporate || data.corporate.length === 0) {
        logger.info(`No corporate actions found for ${symbol}`);
        return [];
      }

      const savedDocs = [];

      for (const action of data.corporate) {
        try {
          const actionDoc = {
            symbol: symbol,
            series: data.series,
            purpose: action.purpose,
            exDate: this.parseDate(action.exDate),
            recordDate: this.parseDate(action.recordDate),
            bcStartDate: this.parseDate(action.bcStartDate),
            bcEndDate: this.parseDate(action.bcEndDate),
            scrapedAt: new Date()
          };

          const saved = await CorporateAction.findOneAndUpdate(
            {
              symbol: symbol,
              exDate: actionDoc.exDate,
              purpose: actionDoc.purpose
            },
            actionDoc,
            { upsert: true, new: true }
          );

          savedDocs.push(saved);

        } catch (error) {
          if (error.code !== 11000) {
            logger.error(`Error saving corporate action:`, error.message);
          }
        }
      }

      logger.success(`Saved ${savedDocs.length} corporate actions for ${symbol}`);
      this.stats.success++;
      await this.sleep(this.config.requestDelay);

      return savedDocs;

    } catch (error) {
      logger.error(`Failed to scrape corporate actions for ${symbol}:`, error.message);
      this.stats.failed++;
      return [];
    }
  }

  // Main: Scrape All Data
  async scrapeAll(symbols, indices) {
    logger.info('=== Starting complete scrape ===');
    logger.info(`Symbols: ${symbols.length}, Indices: ${indices.length}`);

    // Check feature flags
    const enableEquity = process.env.ENABLE_EQUITY_SCRAPING !== 'false';
    const enableHistorical = process.env.ENABLE_HISTORICAL_SCRAPING !== 'false';
    const enableIndex = process.env.ENABLE_INDEX_SCRAPING !== 'false';
    const enableMarketMovers = process.env.ENABLE_MARKET_MOVERS !== 'false';

    logger.info(`Features: Equity=${enableEquity}, Historical=${enableHistorical}, Index=${enableIndex}, MarketMovers=${enableMarketMovers}`);

    this.stats = { success: 0, failed: 0, total: 0, skipped: 0 };
    const startTime = Date.now();

    // Scrape equities
    if (enableEquity && symbols.length > 0) {
      for (const symbol of symbols) {
        this.stats.total++;
        await this.scrapeEquityDetails(symbol);

        if (enableHistorical) {
          await this.scrapeHistoricalData(symbol, parseInt(process.env.HISTORICAL_DAYS || 30));
        }

        await this.scrapeCorporateActions(symbol);
      }
    } else {
      logger.info('Equity scraping disabled or no symbols configured');
      this.stats.skipped += symbols.length;
    }

    // Scrape indices
    if (enableIndex && indices.length > 0) {
      for (const indexName of indices) {
        this.stats.total++;
        await this.scrapeIndexDetails(indexName);
      }
    } else {
      logger.info('Index scraping disabled or no indices configured');
      this.stats.skipped += indices.length;
    }

    // Scrape market movers
    if (enableMarketMovers) {
      this.stats.total++;
      await this.scrapeMarketMovers();
    } else {
      logger.info('Market movers scraping disabled');
      this.stats.skipped++;
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    logger.info('=== Scrape completed ===');
    logger.info(`Duration: ${duration}s`);
    logger.info(`Success: ${this.stats.success}, Failed: ${this.stats.failed}, Skipped: ${this.stats.skipped}, Total: ${this.stats.total}`);

    // Check for high failure rate and provide suggestions
    if (this.stats.failed > this.stats.success && this.stats.failed > 5) {
      logger.warn('\n⚠️  HIGH FAILURE RATE DETECTED');
      logger.warn('Possible causes:');
      logger.warn('  - NSE API blocking (Error 403) - try VPN with India IP');
      logger.warn('  - Library bugs - check for "toUpperCase" or "undefined" errors');
      logger.warn('  - Invalid data format - run: node diagnose-local.js');
      logger.warn('Suggestions:');
      logger.warn('  1. Run diagnostics: node diagnose-local.js');
      logger.warn('  2. Increase REQUEST_DELAY_MS to 2000-3000ms');
      logger.warn('  3. Run during market hours (9:15-15:30 IST)');
      logger.warn('  4. Temporarily disable failing features in .env\n');
    }

    return this.stats;
  }

  getStats() {
    return this.stats;
  }
}

export default NseScraper;
