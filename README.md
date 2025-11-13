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

### Menjalankan Demo

**PENTING:** Karena NSE API memiliki proteksi anti-bot, Anda mungkin mendapat error 403. Untuk melihat format output tanpa koneksi ke NSE:

```bash
npm start
# atau
npm run demo
```

Demo ini akan menampilkan contoh output dari semua fungsi API menggunakan mock data.

### Menjalankan Contoh dengan Data Real

Repository ini menyediakan 3 contoh implementasi dengan data live dari NSE:

#### 1. Basic Usage (Penggunaan Dasar)
```bash
npm run example:basic
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
npm run example:tracker
```

Contoh aplikasi sederhana untuk tracking beberapa saham favorit secara bersamaan.

## 💡 Contoh Penggunaan

### Import Library

```javascript
import stockNseIndia from 'stock-nse-india';

const { NseIndia } = stockNseIndia;
const nse = new NseIndia();
```

### 1. Mendapatkan Semua Symbol Saham

```javascript
const symbols = await nse.getAllStockSymbols();
console.log(`Total saham: ${symbols.length}`);
console.log('Contoh:', symbols.slice(0, 10));
```

### 2. Mendapatkan Detail Saham

```javascript
const details = await nse.getEquityDetails('RELIANCE');
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
// Menggunakan range tanggal
const endDate = new Date();
const startDate = new Date();
startDate.setMonth(startDate.getMonth() - 1); // 1 bulan lalu

const historical = await nse.getEquityHistoricalData('TCS', {
  start: startDate,
  end: endDate
});
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
const gainers = await nse.getTopGainers();
gainers.slice(0, 5).forEach(stock => {
  console.log(`${stock.symbol}: +${stock.pChange}%`);
});

// Top losers
const losers = await nse.getTopLosers();
losers.slice(0, 5).forEach(stock => {
  console.log(`${stock.symbol}: ${stock.pChange}%`);
});
```

### 5. Informasi Index

```javascript
// Daftar semua index
const indices = await nse.getEquityStockIndices();
console.log('Total index:', indices.data?.length);

// Detail Nifty 50
const nifty50 = await nse.getIndexDetails('NIFTY 50');
console.log({
  harga: nifty50.last,
  perubahan: nifty50.pChange,
  high: nifty50.high,
  low: nifty50.low
});
```

## 🔧 API Methods

**Catatan:** Semua method dipanggil melalui instance `nse` (contoh: `nse.getEquityDetails('RELIANCE')`)

### Equity (Saham)

| Method | Deskripsi | Parameter |
|--------|-----------|-----------|
| `nse.getAllStockSymbols()` | Mendapatkan semua symbol saham | - |
| `nse.getEquityDetails(symbol)` | Detail saham tertentu | symbol: string |
| `nse.getEquityHistoricalData(symbol, range)` | Data historical | symbol: string, range: {start: Date, end: Date} |
| `nse.getEquityIntradayData(symbol)` | Data intraday | symbol: string |
| `nse.getEquityCorporateInfo(symbol)` | Corporate actions | symbol: string |
| `nse.getEquityOptionChain(symbol)` | Options chain | symbol: string |

### Index

| Method | Deskripsi | Parameter |
|--------|-----------|-----------|
| `nse.getEquityStockIndices()` | Daftar semua index | - |
| `nse.getIndexDetails(indexName)` | Detail index tertentu | indexName: string |
| `nse.getIndexHistoricalData(indexName, range)` | Data historical index | indexName: string, range: {start: Date, end: Date} |

### Market Movers

| Method | Deskripsi |
|--------|-----------|
| `nse.getTopGainers()` | Saham dengan kenaikan tertinggi |
| `nse.getTopLosers()` | Saham dengan penurunan tertinggi |
| `nse.getTopTurnoverByValue()` | Saham dengan nilai transaksi tertinggi |
| `nse.getTopTurnoverByVolume()` | Saham dengan volume transaksi tertinggi |

## ❗ Troubleshooting

### Error: Request failed with status code 403

Ini adalah error paling umum karena NSE India memiliki proteksi anti-bot yang ketat.

**Solusi:**
1. **Gunakan Demo Mode:**
   ```bash
   npm run demo
   ```
   Demo ini menampilkan format output tanpa koneksi ke NSE.

2. **Lihat Contoh Output:**
   Cek file `examples/output-examples.md` untuk melihat struktur data lengkap.

3. **Untuk Penggunaan Real:**
   - Gunakan VPN dengan IP dari India
   - Jalankan di server yang berada di India
   - Implementasikan custom headers dan cookies handling
   - Gunakan residential proxy

4. **Alternative:**
   Deploy sendiri server dari package ini di environment yang berbeda.

### Error: Cannot find module

Pastikan Anda sudah menjalankan `npm install` untuk menginstall semua dependencies.

### Error: fetch failed atau Network error

- Pastikan koneksi internet Anda stabil
- NSE API mungkin sedang down atau maintenance (jam trading: 9:15 - 15:30 IST)
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