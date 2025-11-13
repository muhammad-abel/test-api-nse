/**
 * Simple Logger Utility
 */

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

class Logger {
  constructor(level = 'info') {
    this.level = levels[level] || levels.info;
  }

  error(message, ...args) {
    if (this.level >= levels.error) {
      console.error(`[ERROR] ${new Date().toISOString()}:`, message, ...args);
    }
  }

  warn(message, ...args) {
    if (this.level >= levels.warn) {
      console.warn(`[WARN]  ${new Date().toISOString()}:`, message, ...args);
    }
  }

  info(message, ...args) {
    if (this.level >= levels.info) {
      console.log(`[INFO]  ${new Date().toISOString()}:`, message, ...args);
    }
  }

  debug(message, ...args) {
    if (this.level >= levels.debug) {
      console.log(`[DEBUG] ${new Date().toISOString()}:`, message, ...args);
    }
  }

  success(message, ...args) {
    if (this.level >= levels.info) {
      console.log(`[✓]     ${new Date().toISOString()}:`, message, ...args);
    }
  }
}

export default new Logger(process.env.LOG_LEVEL || 'info');
