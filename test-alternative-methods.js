import stockNseIndia from 'stock-nse-india';

const { NseIndia } = stockNseIndia;
const nse = new NseIndia();

console.log('=== TESTING ALTERNATIVE METHODS ===\n');

// Test all index-related methods
const indexMethods = [
  'getEquityStockIndices',
  'getAllIndices',
  'getIndexNames',
  'getIndexIntradayData'
];

for (const method of indexMethods) {
  console.log(`\nTesting: nse.${method}()`);
  console.log('-'.repeat(80));

  try {
    let result;

    if (method === 'getIndexIntradayData') {
      result = await nse[method]('NIFTY 50');
    } else {
      result = await nse[method]();
    }

    console.log('✓ Success!');
    console.log('Type:', typeof result);
    console.log('Is Array:', Array.isArray(result));

    if (Array.isArray(result)) {
      console.log('Length:', result.length);
      if (result.length > 0) {
        console.log('First item keys:', Object.keys(result[0]));
        console.log('First item:', JSON.stringify(result[0], null, 2));
      }
    } else if (result && typeof result === 'object') {
      console.log('Keys:', Object.keys(result));
      if (result.data) {
        console.log('Has data property, length:', result.data?.length);
        if (result.data?.length > 0) {
          console.log('First data item:', JSON.stringify(result.data[0], null, 2));
        }
      }
    } else {
      console.log('Result:', result);
    }
  } catch (error) {
    console.log('✗ Failed:', error.message);
  }
}

console.log('\n=== COMPLETE ===');
