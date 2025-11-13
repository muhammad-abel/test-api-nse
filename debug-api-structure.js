import stockNseIndia from 'stock-nse-india';

const { NseIndia } = stockNseIndia;
const nse = new NseIndia();

console.log('=== DEBUGGING API RESPONSE STRUCTURE ===\n');

async function debugHistoricalData() {
  console.log('1. Testing Historical Data Structure:');
  console.log('-'.repeat(80));

  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const data = await nse.getEquityHistoricalData('RELIANCE', {
      start: startDate,
      end: endDate
    });

    console.log('Response type:', typeof data);
    console.log('Is array:', Array.isArray(data));
    console.log('Length:', data?.length);

    if (data && data.length > 0) {
      console.log('\nFirst record:');
      console.log(JSON.stringify(data[0], null, 2));

      console.log('\nKeys in first record:');
      console.log(Object.keys(data[0]));

      console.log('\nChecking date field:');
      console.log('CH_TIMESTAMP:', data[0].CH_TIMESTAMP);
      console.log('TIMESTAMP:', data[0].TIMESTAMP);
      console.log('mTIMESTAMP:', data[0].mTIMESTAMP);
      console.log('Date field:', data[0].date);
    } else {
      console.log('No data or empty array');
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

async function debugIndexData() {
  console.log('\n\n2. Testing Index Data Structure:');
  console.log('-'.repeat(80));

  try {
    const data = await nse.getEquityStockIndices();

    console.log('Response type:', typeof data);
    console.log('Has data property:', !!data?.data);

    if (data && data.data) {
      console.log('Data length:', data.data.length);

      console.log('\nFirst 3 records:');
      data.data.slice(0, 3).forEach((item, i) => {
        console.log(`\nRecord ${i + 1}:`);
        console.log('Keys:', Object.keys(item));
        console.log('index field:', item.index);
        console.log('indexSymbol:', item.indexSymbol);
        console.log('key:', item.key);
        console.log('Full object:', JSON.stringify(item, null, 2));
      });

      console.log('\nSearching for NIFTY 50:');
      const nifty = data.data.find(idx => {
        const hasIndex = idx.index && idx.index.includes('NIFTY');
        const hasKey = idx.key && idx.key.includes('NIFTY');
        const hasSymbol = idx.indexSymbol && idx.indexSymbol.includes('NIFTY');

        if (hasIndex || hasKey || hasSymbol) {
          console.log('Found:', {
            index: idx.index,
            key: idx.key,
            indexSymbol: idx.indexSymbol
          });
        }

        return hasIndex || hasKey || hasSymbol;
      });

      if (nifty) {
        console.log('\nNIFTY 50 data:');
        console.log(JSON.stringify(nifty, null, 2));
      } else {
        console.log('NIFTY 50 not found');
      }
    } else {
      console.log('No data property');
      console.log('Response:', data);
    }
  } catch (error) {
    console.log('Error:', error.message);
    console.log('Stack:', error.stack);
  }
}

// Run debugging
(async () => {
  await debugHistoricalData();
  await debugIndexData();
  console.log('\n=== DEBUG COMPLETE ===');
})();
