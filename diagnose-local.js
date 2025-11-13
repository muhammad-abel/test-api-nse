import stockNseIndia from 'stock-nse-india';

const { NseIndia } = stockNseIndia;
const nse = new NseIndia();

console.log('=== DIAGNOSING LOCAL API RESPONSES ===\n');

async function diagnoseHistoricalData() {
  console.log('1. Testing Historical Data:');
  console.log('-'.repeat(80));

  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const data = await nse.getEquityHistoricalData('RELIANCE', {
      start: startDate,
      end: endDate
    });

    if (data && data.length > 0) {
      console.log('✓ Success! Got', data.length, 'records');
      console.log('\nFirst record fields:', Object.keys(data[0]));
      console.log('\nDate fields found:');
      console.log('  - CH_TIMESTAMP:', data[0].CH_TIMESTAMP);
      console.log('  - TIMESTAMP:', data[0].TIMESTAMP);
      console.log('  - mTIMESTAMP:', data[0].mTIMESTAMP);
      console.log('  - date:', data[0].date);

      console.log('\nFull first record:');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log('✗ No data returned');
    }
  } catch (error) {
    console.log('✗ Error:', error.message);
  }
}

async function diagnoseIndexData() {
  console.log('\n\n2. Testing Index Data with getAllIndices():');
  console.log('-'.repeat(80));

  try {
    const data = await nse.getAllIndices();

    if (data && data.data) {
      console.log('✓ Success! Got', data.data.length, 'indices');

      console.log('\nFirst 3 index records:');
      data.data.slice(0, 3).forEach((item, i) => {
        console.log(`\n  Record ${i + 1}:`);
        console.log('    Fields:', Object.keys(item).join(', '));
        console.log('    Name fields:');
        console.log('      - index:', item.index);
        console.log('      - indexSymbol:', item.indexSymbol);
        console.log('      - key:', item.key);
      });

      console.log('\n\nSearching for NIFTY 50...');
      const nifty = data.data.find(idx => {
        const name = idx.index || idx.indexSymbol || idx.key || '';
        return name.toUpperCase().includes('NIFTY');
      });

      if (nifty) {
        console.log('✓ Found NIFTY!');
        console.log('Full record:');
        console.log(JSON.stringify(nifty, null, 2));
      } else {
        console.log('✗ NIFTY not found');
      }
    } else {
      console.log('✗ No data returned');
    }
  } catch (error) {
    console.log('✗ Error:', error.message);
  }
}

async function diagnoseMarketMovers() {
  console.log('\n\n3. Testing Market Movers:');
  console.log('-'.repeat(80));

  try {
    const data = await nse.getPreOpenMarketData();

    if (data && data.data) {
      console.log('✓ Success! Got', data.data.length, 'pre-open records');

      const sorted = [...data.data].sort((a, b) => (b.pChange || 0) - (a.pChange || 0));
      const gainers = sorted.slice(0, 5);
      const losers = sorted.slice(-5).reverse();

      console.log('\nTop 5 Gainers:');
      gainers.forEach(g => {
        console.log(`  ${g.symbol}: ${g.pChange}%`);
      });

      console.log('\nTop 5 Losers:');
      losers.forEach(l => {
        console.log(`  ${l.symbol}: ${l.pChange}%`);
      });
    } else {
      console.log('✗ No data returned');
    }
  } catch (error) {
    console.log('✗ Error:', error.message);
  }
}

// Run all diagnostics
(async () => {
  await diagnoseHistoricalData();
  await diagnoseIndexData();
  await diagnoseMarketMovers();
  console.log('\n=== DIAGNOSIS COMPLETE ===');
  console.log('\nPlease share this output to help fix any remaining issues.');
})();
