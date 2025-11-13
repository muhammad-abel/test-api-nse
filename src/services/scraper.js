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

      const data = await this.retryOperation(
        () => this.nse.getEquityHistoricalData(symbol, { start: startDate, end: endDate }),
        `getEquityHistoricalData(${symbol})`
      );

      if (!data || data.length === 0) {
        logger.warn(`No historical data found for ${symbol}`);
        return [];
      }

      const savedDocs = [];

      for (const record of data) {
        try {
          const historicalDoc = {
            symbol: symbol,
            date: new Date(record.CH_TIMESTAMP),
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
      logger.error(`Failed to scrape historical data for ${symbol}:`, error.message);
      this.stats.failed++;
      return [];
    }
  }

  // 3. Scrape Index Data
  async scrapeIndexDetails(indexName) {
    try {
      logger.info(`Scraping index details for ${indexName}...`);

      const data = await this.retryOperation(
        () => this.nse.getIndexDetails(indexName),
        `getIndexDetails(${indexName})`
      );

      const indexDoc = {
        name: indexName,
        last: data.last,
        open: data.open,
        high: data.high,
        low: data.low,
        previousClose: data.previousClose,
        change: data.change,
        pChange: data.pChange,
        yearHigh: data.yearHigh,
        yearLow: data.yearLow,
        peRatio: data.pe,
        pbRatio: data.pb,
        dividendYield: data.dy,
        advances: data.advances,
        declines: data.declines,
        unchanged: data.unchanged,
        perChange30d: data.perChange30d,
        perChange365d: data.perChange365d,
        scrapedAt: new Date()
      };

      const saved = await Index.create(indexDoc);
      logger.success(`Saved index data for ${indexName}`);

      this.stats.success++;
      await this.sleep(this.config.requestDelay);

      return saved;

    } catch (error) {
      logger.error(`Failed to scrape index ${indexName}:`, error.message);
      this.stats.failed++;
      return null;
    }
  }

  // 4. Scrape Market Movers
  async scrapeMarketMovers() {
    try {
      logger.info('Scraping market movers...');

      // Get top gainers
      const gainers = await this.retryOperation(
        () => this.nse.getTopGainers(),
        'getTopGainers()'
      );

      for (const [index, stock] of gainers.slice(0, 10).entries()) {
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

      await this.sleep(this.config.requestDelay);

      // Get top losers
      const losers = await this.retryOperation(
        () => this.nse.getTopLosers(),
        'getTopLosers()'
      );

      for (const [index, stock] of losers.slice(0, 10).entries()) {
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

      logger.success(`Saved ${gainers.length + losers.length} market movers`);
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
            exDate: action.exDate ? new Date(action.exDate) : null,
            recordDate: action.recordDate ? new Date(action.recordDate) : null,
            bcStartDate: action.bcStartDate ? new Date(action.bcStartDate) : null,
            bcEndDate: action.bcEndDate ? new Date(action.bcEndDate) : null,
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

    this.stats = { success: 0, failed: 0, total: 0 };
    const startTime = Date.now();

    // Scrape equities
    for (const symbol of symbols) {
      this.stats.total++;
      await this.scrapeEquityDetails(symbol);
      await this.scrapeHistoricalData(symbol, parseInt(process.env.HISTORICAL_DAYS || 30));
      await this.scrapeCorporateActions(symbol);
    }

    // Scrape indices
    for (const indexName of indices) {
      this.stats.total++;
      await this.scrapeIndexDetails(indexName);
    }

    // Scrape market movers
    this.stats.total++;
    await this.scrapeMarketMovers();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    logger.info('=== Scrape completed ===');
    logger.info(`Duration: ${duration}s`);
    logger.info(`Success: ${this.stats.success}, Failed: ${this.stats.failed}, Total: ${this.stats.total}`);

    return this.stats;
  }

  getStats() {
    return this.stats;
  }
}

export default NseScraper;
