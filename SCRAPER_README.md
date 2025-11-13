# NSE Data Scraper with MongoDB Storage

Sistem scraping otomatis untuk mengambil data saham NSE India dan menyimpannya ke MongoDB untuk analisis dan tracking jangka panjang.

## 📋 Daftar Isi

- [Fitur](#fitur)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [MongoDB Schema](#mongodb-schema)
- [Cara Menggunakan](#cara-menggunakan)
- [Query Data](#query-data)
- [Production Setup](#production-setup)

## ✨ Fitur

### Data yang Di-scrape

1. **Equity Details** (Real-time)
   - Price data (OHLC, Last Price, VWAP)
   - Volume & Turnover
   - Market Cap & Ratios (PE, PB)
   - 52 Week High/Low
   - Circuit Limits
   - Company info

2. **Historical Data** (OHLCV)
   - Daily candlestick data
   - Volume & Value
   - Delivery data
   - Configurable date range

3. **Index Data**
   - Index values & changes
   - Market breadth (advances/declines)
   - Index ratios (PE, PB)
   - Performance metrics

4. **Market Movers**
   - Top Gainers (top 10)
   - Top Losers (top 10)
   - Most Active by Value
   - Most Active by Volume

5. **Corporate Actions**
   - Dividend announcements
   - Bonus issues
   - Stock splits
   - Rights issues
   - Ex-dates & Record dates

### Fitur Teknis

- ✅ **Automated Scheduling** - Scraping berkala dengan cron
- ✅ **Error Handling** - Retry logic dengan exponential backoff
- ✅ **Rate Limiting** - Delay antar request untuk avoid blocking
- ✅ **Data Validation** - Schema validation dengan Mongoose
- ✅ **Duplicate Prevention** - Unique indexes untuk prevent duplikat
- ✅ **Logging** - Comprehensive logging system
- ✅ **Statistics** - Success/failure tracking

## 🚀 Instalasi

### Prerequisites

1. **Node.js** (v18+)
2. **MongoDB** (v4.4+)

### Install MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Windows:**
- Download dari: https://www.mongodb.com/try/download/community
- Install dan start MongoDB service

**Docker (Recommended):**
```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:latest
```

### Install Dependencies

```bash
npm install
```

Dependencies yang terinstall:
- `mongoose` - MongoDB ODM
- `node-cron` - Scheduler
- `dotenv` - Environment variables
- `stock-nse-india` - NSE API wrapper

## ⚙️ Konfigurasi

### 1. Copy .env.example ke .env

```bash
cp .env.example .env
```

### 2. Edit .env File

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/nse_stock_data

# Scraper Configuration
SCRAPE_INTERVAL_MINUTES=15       # Run every 15 minutes
MAX_RETRIES=3                     # Retry failed requests 3x
RETRY_DELAY_MS=2000               # Wait 2s before retry
REQUEST_DELAY_MS=1000             # Wait 1s between requests

# Watchlist Configuration (comma-separated)
WATCHLIST_SYMBOLS=RELIANCE,TCS,INFY,HDFCBANK,ICICIBANK,WIPRO,BHARTIARTL,ITC,SBIN,LT

# Index List (comma-separated)
INDEX_LIST=NIFTY 50,NIFTY BANK,NIFTY IT,NIFTY AUTO

# Historical Data Range (in days)
HISTORICAL_DAYS=30

# Logging
LOG_LEVEL=info
```

### 3. Konfigurasi MongoDB

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/nse_stock_data
```

**MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nse_stock_data
```

**Docker:**
```env
MONGODB_URI=mongodb://host.docker.internal:27017/nse_stock_data
```

## 📊 MongoDB Schema

### 1. Equities Collection

```javascript
{
  symbol: "RELIANCE",
  companyName: "Reliance Industries Limited",
  industry: "REFINERIES",
  lastPrice: 2456.75,
  change: 23.50,
  pChange: 0.97,
  yearHigh: 3217.60,
  yearLow: 2116.50,
  marketCap: 16630000000000,
  peRatio: 21.45,
  totalTradedVolume: 8765432,
  scrapedAt: ISODate("2024-11-13T10:30:00Z"),
  createdAt: ISODate("2024-11-13T10:30:00Z")
}
```

### 2. Historical Data Collection

```javascript
{
  symbol: "TCS",
  date: ISODate("2024-11-12"),
  open: 4080.00,
  high: 4125.50,
  low: 4065.30,
  close: 4115.75,
  totalTradedVolume: 1234567,
  vwap: 4098.45,
  scrapedAt: ISODate("2024-11-13T10:30:00Z")
}
```

### 3. Indices Collection

```javascript
{
  name: "NIFTY 50",
  last: 19456.75,
  change: 125.30,
  pChange: 0.65,
  yearHigh: 20222.45,
  yearLow: 16828.35,
  peRatio: 21.34,
  advances: 32,
  declines: 18,
  scrapedAt: ISODate("2024-11-13T10:30:00Z")
}
```

### 4. Market Movers Collection

```javascript
{
  type: "gainer",
  symbol: "ADANIPORTS",
  lastPrice: 1234.50,
  pChange: 7.45,
  rank: 1,
  date: ISODate("2024-11-13"),
  scrapedAt: ISODate("2024-11-13T10:30:00Z")
}
```

### 5. Corporate Actions Collection

```javascript
{
  symbol: "INFY",
  purpose: "Interim Dividend - Rs 21 Per Share",
  exDate: ISODate("2024-10-18"),
  recordDate: ISODate("2024-10-18"),
  scrapedAt: ISODate("2024-11-13T10:30:00Z")
}
```

## 🎯 Cara Menggunakan

### 1. Run Once (Single Scrape)

Jalankan scraper sekali untuk testing:

```bash
npm run scraper:once
```

Output:
```
[INFO]  Initializing application...
[✓]     MongoDB connected successfully
[INFO]  Running scraper once...
[INFO]  ================================================================================
[INFO]  Starting scrape at 13/11/2024, 10:30:00
[INFO]  ================================================================================

[INFO]  Scraping equity details for RELIANCE...
[✓]     Saved equity data for RELIANCE
[INFO]  Scraping historical data for RELIANCE (30 days)...
[✓]     Saved 22 historical records for RELIANCE
...
[INFO]  ================================================================================
[INFO]  Scrape Summary:
[INFO]    Success: 28
[INFO]    Failed: 2
[INFO]    Total: 30
[INFO]    Success Rate: 93.33%
[INFO]  ================================================================================
```

### 2. Run with Scheduler (Continuous)

Jalankan scraper yang akan berjalan terus dengan interval tertentu:

```bash
npm run scraper:start
```

Scraper akan:
1. Run scrape pertama kali immediately
2. Setup cron job sesuai `SCRAPE_INTERVAL_MINUTES`
3. Run scrape setiap interval
4. Terus berjalan sampai di-stop (Ctrl+C)

### 3. Production dengan PM2

Install PM2:
```bash
npm install -g pm2
```

Start scraper:
```bash
pm2 start src/app.js --name nse-scraper -- scheduled
pm2 save
pm2 startup
```

Monitor:
```bash
pm2 status
pm2 logs nse-scraper
pm2 monit
```

Stop:
```bash
pm2 stop nse-scraper
pm2 delete nse-scraper
```

## 🔍 Query Data

### Menggunakan MongoDB Shell

```bash
mongosh nse_stock_data
```

**1. Get Latest Price untuk Symbol:**
```javascript
db.equities.find({ symbol: "RELIANCE" }).sort({ scrapedAt: -1 }).limit(1)
```

**2. Get Historical Data (30 hari):**
```javascript
db.historical_data.find({
  symbol: "TCS",
  date: { $gte: new Date("2024-10-14") }
}).sort({ date: -1 })
```

**3. Get Top Gainers Hari Ini:**
```javascript
db.market_movers.find({
  type: "gainer",
  date: { $gte: new Date().setHours(0,0,0,0) }
}).sort({ rank: 1 }).limit(10)
```

**4. Get Index Performance:**
```javascript
db.indices.find({ name: "NIFTY 50" }).sort({ scrapedAt: -1 }).limit(10)
```

**5. Get Corporate Actions (Upcoming):**
```javascript
db.corporate_actions.find({
  exDate: { $gte: new Date() }
}).sort({ exDate: 1 })
```

**6. Aggregate - Daily Volume Trend:**
```javascript
db.historical_data.aggregate([
  { $match: { symbol: "RELIANCE" } },
  { $group: {
    _id: "$date",
    avgVolume: { $avg: "$totalTradedVolume" },
    totalValue: { $sum: "$totalTradedValue" }
  }},
  { $sort: { _id: -1 } },
  { $limit: 30 }
])
```

### Menggunakan Node.js Script

```javascript
import mongoose from 'mongoose';
import Equity from './src/models/Equity.js';

await mongoose.connect('mongodb://localhost:27017/nse_stock_data');

// Get latest prices
const latestPrices = await Equity.aggregate([
  { $sort: { scrapedAt: -1 } },
  { $group: {
    _id: "$symbol",
    lastDoc: { $first: "$$ROOT" }
  }},
  { $replaceRoot: { newRoot: "$lastDoc" } }
]);

console.log(latestPrices);
```

## 📈 Analytics Examples

### 1. Price Movement Analysis

```javascript
// Calculate price change percentage in last 7 days
db.equities.aggregate([
  {
    $match: {
      symbol: "RELIANCE",
      scrapedAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) }
    }
  },
  { $sort: { scrapedAt: 1 } },
  {
    $group: {
      _id: "$symbol",
      firstPrice: { $first: "$lastPrice" },
      lastPrice: { $last: "$lastPrice" },
      avgPrice: { $avg: "$lastPrice" },
      minPrice: { $min: "$lastPrice" },
      maxPrice: { $max: "$lastPrice" }
    }
  },
  {
    $project: {
      symbol: "$_id",
      priceChange: { $subtract: ["$lastPrice", "$firstPrice"] },
      priceChangePct: {
        $multiply: [
          { $divide: [
            { $subtract: ["$lastPrice", "$firstPrice"] },
            "$firstPrice"
          ]},
          100
        ]
      },
      avgPrice: 1,
      volatility: { $subtract: ["$maxPrice", "$minPrice"] }
    }
  }
])
```

### 2. Volume Pattern Detection

```javascript
// Find days with abnormal volume
db.historical_data.aggregate([
  { $match: { symbol: "TCS" } },
  {
    $group: {
      _id: "$symbol",
      avgVolume: { $avg: "$totalTradedVolume" },
      stdDev: { $stdDevPop: "$totalTradedVolume" }
    }
  },
  {
    $lookup: {
      from: "historical_data",
      let: { sym: "$_id", avg: "$avgVolume", std: "$stdDev" },
      pipeline: [
        { $match: { $expr: { $eq: ["$symbol", "$$sym"] }}},
        {
          $project: {
            date: 1,
            volume: "$totalTradedVolume",
            zScore: {
              $divide: [
                { $subtract: ["$totalTradedVolume", "$$avg"] },
                "$$std"
              ]
            }
          }
        },
        { $match: { zScore: { $gt: 2 } }}, // More than 2 std dev
        { $sort: { date: -1 } }
      ],
      as: "abnormalDays"
    }
  }
])
```

## 🏭 Production Setup

### Environment Variables untuk Production

```env
# Production MongoDB (Atlas)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nse_stock_data?retryWrites=true&w=majority

# Aggressive scraping settings
SCRAPE_INTERVAL_MINUTES=5
MAX_RETRIES=5
RETRY_DELAY_MS=3000
REQUEST_DELAY_MS=1500

# Extended watchlist
WATCHLIST_SYMBOLS=RELIANCE,TCS,INFY,HDFCBANK,ICICIBANK,WIPRO,BHARTIARTL,ITC,SBIN,LT,KOTAKBANK,ASIANPAINT,AXISBANK,BAJFINANCE,BAJAJFINSV,BRITANNIA,COALINDIA,DIVISLAB,DRREDDY,EICHERMOT

# More indices
INDEX_LIST=NIFTY 50,NIFTY BANK,NIFTY IT,NIFTY AUTO,NIFTY PHARMA,NIFTY FMCG,NIFTY METAL,NIFTY REALTY

# More historical data
HISTORICAL_DAYS=90

# Less verbose logging
LOG_LEVEL=warn
```

### Docker Setup

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

CMD ["node", "src/app.js", "scheduled"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: nse_stock_data

  scraper:
    build: .
    depends_on:
      - mongodb
    environment:
      MONGODB_URI: mongodb://mongodb:27017/nse_stock_data
      SCRAPE_INTERVAL_MINUTES: 15
    restart: unless-stopped

volumes:
  mongodb_data:
```

Run:
```bash
docker-compose up -d
```

### Monitoring & Alerts

**Log to File dengan PM2:**
```bash
pm2 start src/app.js --name nse-scraper --log /var/log/nse-scraper.log -- scheduled
```

**Setup Alerts (contoh dengan Discord webhook):**
```javascript
// Add to scraper.js
async notifyFailure(stats) {
  if (stats.failed > stats.total * 0.3) { // 30% failure rate
    // Send alert via webhook
    await fetch(process.env.DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `⚠️ High failure rate: ${stats.failed}/${stats.total}`
      })
    });
  }
}
```

## ⚠️ Important Notes

### Rate Limiting & Blocking

NSE API memiliki proteksi anti-bot yang ketat:

1. **Error 403 Frequent**
   - Gunakan VPN dengan IP India
   - Increase `REQUEST_DELAY_MS` ke 2000-3000ms
   - Reduce scraping frequency

2. **Best Practices:**
   - Scrape during market hours (9:15 - 15:30 IST)
   - Don't scrape too many symbols at once
   - Use exponential backoff on failures

3. **Alternative Solutions:**
   - Deploy di server India
   - Use residential proxy
   - Implement cookie/session management

### Data Integrity

1. **Unique Constraints:**
   - Historical data: unique (symbol, date)
   - Corporate actions: unique (symbol, exDate, purpose)

2. **Upsert Strategy:**
   - Prevents duplicates
   - Updates existing records
   - Safe for re-runs

3. **Data Validation:**
   - Mongoose schema validation
   - Type checking
   - Required fields enforcement

## 📝 Troubleshooting

**MongoDB Connection Error:**
```bash
# Check MongoDB status
mongosh
# atau
sudo systemctl status mongod
```

**High Memory Usage:**
- Reduce `WATCHLIST_SYMBOLS` count
- Increase `SCRAPE_INTERVAL_MINUTES`
- Add MongoDB indexes

**Scraper Crashes:**
```bash
# Check logs
pm2 logs nse-scraper --lines 100

# Restart
pm2 restart nse-scraper
```

## 📚 Resources

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Aggregation](https://www.mongodb.com/docs/manual/aggregation/)
- [node-cron](https://github.com/node-cron/node-cron)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)

---

**Dibuat dengan ❤️ untuk analisis pasar saham India**
