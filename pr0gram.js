const fs = require('node:fs');

try {
  const pd = fs.readFileSync('pd.json', 'utf8');
  console.log(pd.substring(0,8));
} catch (err) {
  console.error(err);
}
