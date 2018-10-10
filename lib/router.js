const url = require('url');
const parser = require('./parser');

var Router = {
  methods: ['get', 'post'],

  routes: {}
}

var _extractPostData = (req, done) => {
  let body = '';
  req.on('data', data =>{ 
    body += data;
  });
  req.on('end', () => {
    req.body = body;
    done();
  });
}

Router.methods.forEach( method => {
  Router.routes[method] = Router.routes[method] || {};

  Router[method] = (path, callback) => {
    let params = {};
    let splitPath = parser.splitPath(path);

    let pathParams = splitPath.filter( param => {
      return param[0] == ':';
    }).map( param => {
      params[param.slice(1)] = '';
      return params;
    })

    Router.routes[method][path] = {callback: callback, params: pathParams};
  }
})

Router.handle = (req, res) => {
  let method = req.method.toLowerCase();

  let path = url.parse(req.url).pathname;

  let patterns = Object.keys(Router.routes[method]);

  let regexPaths = [];

  patterns.forEach(pattern => {
    pattern = parser.splitPath(pattern);
    pattern = pattern.map(term => {
      return term.replace(/:\w+/, '\\w+');
    })
    pattern = new RegExp(pattern.join('/'), 'g');
    regexPaths.push(pattern);
  })

  let pattern;

  regexPaths.forEach((regex, i) => {
    if (regex.exec(path)){
      pattern = patterns[i];
    }
  })


  let splitPath = parser.splitPath(path);
  let splitPattern = parser.splitPath(pattern);
  req.params = {};


  splitPattern.forEach((term, i) => {
    if (term[0] == ':') {
      req.params[term.slice(1)] = splitPath[i];
    }
  })

  path = pattern;

  

  // path = parser.splitPath(path);
  
  // req.params = {};

  // patterns.forEach( pattern => {
  //   pattern = parser.splitPath(pattern);
  //   if( pattern.length != path.length ) {
  //     return;
  //   }
  //   pattern.forEach((term, i) => {
  //     if (term[0] == ':'){
  //       req.params[term.slice(1)] = path[i];
  //       path[i] = term;
  //     }
  //   })

  // })

  // if (path[0] != '/'){
  //   path = '/' + path.join('/');
  // }

  let p = new Promise(resolve => {
    if (method == 'get') {
      resolve();
    } else {
      _extractPostData(req, resolve);
    }
  })

  p.then(() => {
    if (Router.routes[method][path]) {
      Router.routes[method][path].callback(req, res);
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  });
}

module.exports = Router;