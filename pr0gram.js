const fs = require('node:fs');

try {
  const pd = fs.readFileSync('pd.json', 'utf8');
  const sd = fs.readFileSync('sd.json', 'utf8');
  
  fs.writeFile('data.json', "HELLO", err => {
  if (err) {
    console.error(err);
  } else {
    console.log("written successfully")
  }
});
} catch (err) {
  console.error(err);
}
