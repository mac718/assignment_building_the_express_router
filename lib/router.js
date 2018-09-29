const url = require('url');

var Router = {
  methods: ['get', 'post'],

  routes: {}
}

Router.methods.forEach(method => {
  Router.routes[method] = Router.routes[method] || {};

  Router[method] = (path, callback) => {
    Router.routes[method][path] = callback;
  }
})

Router.handle = (req, res) => {
  var method = req.method.toLowerCase();

  var path = url.parse(req.url).pathname;

  if (Router.routes[method][path]) {
    Router.routes[method][path](req, res);
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
}



module.exports = Router;