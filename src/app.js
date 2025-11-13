/**
 * Main Application - NSE Data Scraper
 */

import dotenv from 'dotenv';
import cron from 'node-cron';
import database from './utils/database.js';
import logger from './utils/logger.js';
import NseScraper from './services/scraper.js';

// Load environment variables
dotenv.config();

class App {
  constructor() {
    this.scraper = null;
    this.cronJob = null;
    this.isRunning = false;
  }

  async initialize() {
    try {
      logger.info('=== NSE Data Scraper ===');
      logger.info('Initializing application...');

      // Connect to MongoDB
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nse_stock_data';
      await database.connect(mongoUri);

      // Initialize scraper
      this.scraper = new NseScraper({
        maxRetries: parseInt(process.env.MAX_RETRIES || 3),
        retryDelay: parseInt(process.env.RETRY_DELAY_MS || 2000),
        requestDelay: parseInt(process.env.REQUEST_DELAY_MS || 1000)
      });

      logger.success('Application initialized successfully');

    } catch (error) {
      logger.error('Failed to initialize application:', error.message);
      throw error;
    }
  }

  async runScraper() {
    if (this.isRunning) {
      logger.warn('Scraper is already running, skipping this cycle');
      return;
    }

    try {
      this.isRunning = true;

      // Parse symbols from environment
      const symbols = (process.env.WATCHLIST_SYMBOLS || '')
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const indices = (process.env.INDEX_LIST || '')
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      if (symbols.length === 0 && indices.length === 0) {
        logger.warn('No symbols or indices configured. Please set WATCHLIST_SYMBOLS and INDEX_LIST in .env');
        return;
      }

      logger.info(`\n${'='.repeat(80)}`);
      logger.info(`Starting scrape at ${new Date().toLocaleString()}`);
      logger.info(`${'='.repeat(80)}\n`);

      // Run scraper
      const stats = await this.scraper.scrapeAll(symbols, indices);

      logger.info(`\n${'='.repeat(80)}`);
      logger.info('Scrape Summary:');
      logger.info(`  Success: ${stats.success}`);
      logger.info(`  Failed: ${stats.failed}`);
      logger.info(`  Total: ${stats.total}`);
      logger.info(`  Success Rate: ${((stats.success / stats.total) * 100).toFixed(2)}%`);
      logger.info(`${'='.repeat(80)}\n`);

    } catch (error) {
      logger.error('Error during scraping:', error.message);
    } finally {
      this.isRunning = false;
    }
  }

  startScheduler() {
    const interval = parseInt(process.env.SCRAPE_INTERVAL_MINUTES || 15);

    logger.info(`Setting up scheduler (interval: ${interval} minutes)...`);

    // Create cron pattern (every X minutes)
    const cronPattern = `*/${interval} * * * *`;

    this.cronJob = cron.schedule(cronPattern, () => {
      this.runScraper();
    });

    logger.success(`Scheduler started. Next run in ${interval} minutes.`);
    logger.info('Press Ctrl+C to stop.');
  }

  async runOnce() {
    logger.info('Running scraper once...');
    await this.runScraper();
    logger.info('Single run completed. Exiting...');
    await this.shutdown();
  }

  async runScheduled() {
    // Run immediately on start
    logger.info('Running initial scrape...');
    await this.runScraper();

    // Then start scheduler
    this.startScheduler();
  }

  async shutdown() {
    logger.info('Shutting down application...');

    if (this.cronJob) {
      this.cronJob.stop();
      logger.info('Scheduler stopped');
    }

    await database.disconnect();
    logger.success('Application shutdown complete');
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Main execution
const app = new App();

async function main() {
  try {
    await app.initialize();

    const mode = process.argv[2] || 'scheduled';

    if (mode === 'once') {
      await app.runOnce();
    } else {
      await app.runScheduled();
    }

  } catch (error) {
    logger.error('Fatal error:', error);
    process.exit(1);
  }
}

// Start the application
main();

export default app;
