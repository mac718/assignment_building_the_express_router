const router = require('../lib/router');

router.get('/', (req, res) => {
  res.end('Hello Get!');
});

router.post('/', (req, res) => {
  res.end('Hello Post!');
});

module.exports = router.routes;