const http = require('http');
const router = require('./router');

var express = () => {
  var app = {
    listen: (port, host) => {

      let server = http.createServer(router.handle);

      server.listen(port, host, () => {
        console.log('listening');
      })

    },
    
    get: (path, callback) => {
      router.get(path, callback);
    },

    post: (path, callback) => {
      router.post(path, callback);
    }
  }

  return app;
}

module.exports = express;