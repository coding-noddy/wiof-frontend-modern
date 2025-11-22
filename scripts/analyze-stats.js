const fs = require('fs');
const path = require('path');
const statsPath = path.resolve(__dirname, '..', 'dist', 'wiof-frontend-modern', 'stats.json');
if (!fs.existsSync(statsPath)) {
  console.error('stats.json not found at', statsPath);
  process.exit(2);
}
const s = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
const inputs = s.inputs || {};
const arr = Object.entries(inputs).map(([k,v])=>({k,bytes:(v && v.bytes) || 0})).sort((a,b)=>b.bytes-a.bytes);
const top = arr.slice(0,40);
console.log('Top inputs by bytes:');
for (const item of top) {
  console.log(`${item.bytes}\t${item.k}`);
}
// Also summarize assets sizes from s.assets if present
if (s.assets) {
  const assets = (s.assets||[]).map(a=>({name:a.name,size:a.size||0})).sort((a,b)=>b.size-a.size).slice(0,30);
  console.log('\nTop assets:');
  for (const a of assets) console.log(`${a.size}\t${a.name}`);
}
// Write JSON summary
fs.writeFileSync(path.resolve(__dirname, '..', 'dist', 'wiof-frontend-modern', 'stats-summary.json'), JSON.stringify({topInputs:top,assets:s.assets||[]},null,2));
console.log('\nWrote dist/wiof-frontend-modern/stats-summary.json');
