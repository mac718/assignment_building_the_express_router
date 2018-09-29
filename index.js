const express = require('./lib/express');
const app = express();

app.get('/', (req, res) => {
  res.end('Hiya');
});

app.listen(3000, 'localhost');