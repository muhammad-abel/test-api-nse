# Stock NSE India API - Panduan Penggunaan

Implementasi dan contoh penggunaan API **stock-nse-india** untuk mengakses data saham dari National Stock Exchange (NSE) India.

## 📋 Daftar Isi

- [Tentang](#tentang)
- [Instalasi](#instalasi)
- [Fitur Utama](#fitur-utama)
- [Cara Menggunakan](#cara-menggunakan)
- [Contoh Penggunaan](#contoh-penggunaan)
- [API Methods](#api-methods)
- [Troubleshooting](#troubleshooting)

## 🎯 Tentang

Repository ini berisi implementasi dan berbagai contoh penggunaan API **stock-nse-india**, sebuah unofficial API untuk mengakses data saham dari NSE India. API ini menyediakan:

- Data saham real-time
- Data historical
- Informasi index
- Corporate actions
- Top gainers/losers
- Dan banyak lagi

## 🚀 Instalasi

### Prerequisites

- Node.js versi 18 atau lebih baru
- npm atau yarn

### Langkah Instalasi

1. Clone repository ini:
```bash
git clone <repository-url>
cd test-api-nse
```

2. Install dependencies:
```bash
npm install
```

## ✨ Fitur Utama

- ✅ Mendapatkan daftar semua symbol saham
- ✅ Detail saham (harga, volume, perubahan, dll)
- ✅ Data historical dengan berbagai rentang waktu
- ✅ Data intraday
- ✅ Informasi corporate actions
- ✅ Daftar dan detail index (Nifty 50, Bank Nifty, dll)
- ✅ Top gainers, losers, dan most active stocks
- ✅ Options chain data

## 📖 Cara Menggunakan

### Menjalankan Contoh

Repository ini menyediakan 3 contoh implementasi:

#### 1. Basic Usage (Penggunaan Dasar)
```bash
npm run example:basic
# atau
npm start
```

Contoh ini menunjukkan:
- Cara mendapatkan daftar semua saham
- Cara mendapatkan detail saham tertentu
- Cara mendapatkan data historical
- Cara mendapatkan data intraday

#### 2. Detailed Usage (Penggunaan Lanjutan)
```bash
npm run example:detailed
```

Contoh ini menunjukkan:
- Top gainers dan losers
- Saham dengan volume trading tertinggi
- Analisis detail saham
- Corporate actions
- Informasi index

#### 3. Stock Tracker (Portfolio Tracker)
```bash
node examples/stock-tracker.js
```

Contoh aplikasi sederhana untuk tracking beberapa saham favorit secara bersamaan.

## 💡 Contoh Penggunaan

### Import Library

```javascript
import {
  getAllStockSymbols,
  getEquityDetails,
  getEquityHistoricalData,
  getTopGainers,
  getTopLosers
} from 'stock-nse-india';
```

### 1. Mendapatkan Semua Symbol Saham

```javascript
const symbols = await getAllStockSymbols();
console.log(`Total saham: ${symbols.length}`);
console.log('Contoh:', symbols.slice(0, 10));
```

### 2. Mendapatkan Detail Saham

```javascript
const details = await getEquityDetails('RELIANCE');
console.log({
  nama: details.info?.companyName,
  harga: details.priceInfo?.lastPrice,
  perubahan: details.priceInfo?.pChange,
  dayHigh: details.priceInfo?.intraDayHighLow?.max,
  dayLow: details.priceInfo?.intraDayHighLow?.min
});
```

### 3. Mendapatkan Data Historical

```javascript
// Rentang waktu: '1W', '1M', '3M', '6M', '1Y'
const historical = await getEquityHistoricalData('TCS', '1M');
console.log(`Data tersedia: ${historical.length} hari`);

// Data terbaru
const latest = historical[0];
console.log({
  tanggal: latest.CH_TIMESTAMP,
  open: latest.CH_OPENING_PRICE,
  high: latest.CH_TRADE_HIGH_PRICE,
  low: latest.CH_TRADE_LOW_PRICE,
  close: latest.CH_CLOSING_PRICE,
  volume: latest.CH_TOT_TRADED_QTY
});
```

### 4. Top Gainers & Losers

```javascript
// Top gainers
const gainers = await getTopGainers();
gainers.slice(0, 5).forEach(stock => {
  console.log(`${stock.symbol}: +${stock.pChange}%`);
});

// Top losers
const losers = await getTopLosers();
losers.slice(0, 5).forEach(stock => {
  console.log(`${stock.symbol}: ${stock.pChange}%`);
});
```

### 5. Informasi Index

```javascript
import { getIndexList, getIndexDetails } from 'stock-nse-india';

// Daftar semua index
const indices = await getIndexList();
console.log('Index tersedia:', indices.map(i => i.indexName));

// Detail Nifty 50
const nifty50 = await getIndexDetails('NIFTY 50');
console.log({
  harga: nifty50.last,
  perubahan: nifty50.pChange,
  high: nifty50.high,
  low: nifty50.low
});
```

## 🔧 API Methods

### Equity (Saham)

| Method | Deskripsi | Parameter |
|--------|-----------|-----------|
| `getAllStockSymbols()` | Mendapatkan semua symbol saham | - |
| `getEquityDetails(symbol)` | Detail saham tertentu | symbol: string |
| `getEquityHistoricalData(symbol, range)` | Data historical | symbol: string, range: '1W'\|'1M'\|'3M'\|'6M'\|'1Y' |
| `getEquityIntradayData(symbol)` | Data intraday | symbol: string |
| `getEquityCorporateInfo(symbol)` | Corporate actions | symbol: string |
| `getEquityOptionChain(symbol)` | Options chain | symbol: string |

### Index

| Method | Deskripsi | Parameter |
|--------|-----------|-----------|
| `getIndexList()` | Daftar semua index | - |
| `getIndexDetails(indexName)` | Detail index tertentu | indexName: string |
| `getIndexHistoricalData(indexName, range)` | Data historical index | indexName: string, range: string |

### Market Movers

| Method | Deskripsi |
|--------|-----------|
| `getTopGainers()` | Saham dengan kenaikan tertinggi |
| `getTopLosers()` | Saham dengan penurunan tertinggi |
| `getTopTurnoverByValue()` | Saham dengan nilai transaksi tertinggi |
| `getTopTurnoverByVolume()` | Saham dengan volume transaksi tertinggi |

## ❗ Troubleshooting

### Error: Cannot find module

Pastikan Anda sudah menjalankan `npm install` untuk menginstall semua dependencies.

### Error: fetch failed atau Network error

- Pastikan koneksi internet Anda stabil
- NSE API mungkin sedang down atau maintenance
- Coba tambahkan delay antar request jika terlalu banyak request

### Data tidak lengkap atau null

- Beberapa saham mungkin tidak memiliki data tertentu
- Pastikan symbol saham yang digunakan valid
- Gunakan try-catch untuk handle error

### Rate Limiting

Jika mendapat error rate limiting, tambahkan delay antar request:

```javascript
await new Promise(resolve => setTimeout(resolve, 500)); // Delay 500ms
```

## 📚 Resources

- [NPM Package](https://www.npmjs.com/package/stock-nse-india)
- [GitHub Repository](https://github.com/hi-imcodeman/stock-nse-india)
- [NSE Official Website](https://www.nseindia.com/)

## 📝 Catatan Penting

- Ini adalah **unofficial API** dan tidak berafiliasi dengan NSE
- Data yang didapat adalah untuk tujuan informasi dan edukasi
- Tidak disarankan untuk trading otomatis tanpa validasi lebih lanjut
- Perhatikan rate limiting dan jangan overload server NSE

## 📄 License

ISC

---

Dibuat dengan ❤️ menggunakan [stock-nse-india](https://github.com/hi-imcodeman/stock-nse-india)