import stockNseIndia from 'stock-nse-india';

const { NseIndia } = stockNseIndia;
const nse = new NseIndia();

console.log('Available methods in NseIndia:');
const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(nse))
  .filter(m => !m.startsWith('_') && m !== 'constructor');

methods.forEach(m => console.log(`  - ${m}`));

console.log('\nTesting specific methods:');
console.log('getIndexDetails:', typeof nse.getIndexDetails);
console.log('getTopGainers:', typeof nse.getTopGainers);
console.log('getEquityDetails:', typeof nse.getEquityDetails);
