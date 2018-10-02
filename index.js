const express = require('./lib/express');
const app = express();

app.get('/', (req, res) => {
  res.end('Hiya');
});

app.get('/thing/:param1/:param2', (req, res) => {
  res.end(req.params.param1);
})

app.get('/thing/:param1/other/:param2', (req, res) => {
  res.end(req.params.param2);
})

app.post('/', (req, res) => {
  res.write(req.body);
  res.end('\nPOST !');
})

app.listen(3000, 'localhost');