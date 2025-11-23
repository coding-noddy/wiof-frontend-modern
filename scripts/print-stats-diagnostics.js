const fs = require('fs');
const path = require('path');
const statsPath = path.resolve(__dirname, '..', 'dist', 'wiof-frontend-modern', 'stats.json');
console.log('Stats path:', statsPath);
if (!fs.existsSync(statsPath)) {
  console.error('ERROR: stats.json not found. Did you run ng build --stats-json?');
  process.exit(1);
}
const st = fs.statSync(statsPath);
console.log('stats.json size:', st.size, 'bytes');
console.log('stats.json mtime:', st.mtime.toISOString());
const s = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
const inputs = s.inputs || {};
const arr = Object.entries(inputs).map(([k,v])=>({k,bytes:(v&&v.bytes)||0})).sort((a,b)=>b.bytes-a.bytes).slice(0,40);
console.log('\nTop 40 inputs by bytes:');
arr.forEach(it=>console.log(it.bytes + '\t' + it.k));
if (s.assets && s.assets.length) {
  const assets = s.assets.slice().sort((a,b)=> (b.size||0)-(a.size||0)).slice(0,30);
  console.log('\nTop assets:');
  assets.forEach(a=>console.log((a.size||0) + '\t' + a.name));
}
console.log('\nWrote diagnostics: none (printed to stdout)');
