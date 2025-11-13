import stockNseIndia from 'stock-nse-india';

const { NseIndia } = stockNseIndia;
const nse = new NseIndia();

console.log('Testing API responses...\n');

// Test 1: Historical Data Structure
console.log('1. Testing Historical Data:');
try {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  const historical = await nse.getEquityHistoricalData('RELIANCE', {
    start: startDate,
    end: endDate
  });

  console.log('Historical data count:', historical.length);
  if (historical.length > 0) {
    console.log('Sample record:');
    console.log(JSON.stringify(historical[0], null, 2));
  }
} catch (error) {
  console.log('Error:', error.message);
}

console.log('\n2. Testing Index Methods:');
try {
  const indices = await nse.getEquityStockIndices();
  console.log('Indices data available:', !!indices);
  if (indices && indices.data) {
    console.log('Sample index:', indices.data[0]);
  }
} catch (error) {
  console.log('Error:', error.message);
}

console.log('\n3. Testing PreOpen Market Data (for gainers/losers):');
try {
  const preOpen = await nse.getPreOpenMarketData();
  console.log('PreOpen data available:', !!preOpen);
  if (preOpen) {
    console.log('Keys:', Object.keys(preOpen));
  }
} catch (error) {
  console.log('Error:', error.message);
}

console.log('\n4. Testing Market Status:');
try {
  const status = await nse.getMarketStatus();
  console.log('Market status:', status);
} catch (error) {
  console.log('Error:', error.message);
}
