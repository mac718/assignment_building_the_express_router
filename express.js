const http = require('http');

var app = {
  listen: (port, host) => {

    let server = http.createServer((req, res) => {
      res.end('herro');
    });

    server.listen(port, host, () => {
      console.log('listening');
    })

  },
  
  get: (path, callback) => {

  }
}

app.listen(3000, 'localhost');

module.exports = app;