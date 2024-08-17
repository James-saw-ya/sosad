const fs = require('node:fs');

try {
  const pd = fs.readFileSync('pd.json', 'utf8');
  const sd = fs.readFileSync('sd.json', 'utf8');
  console.log(sd.substring(0,8));
} catch (err) {
  console.error(err);
}
