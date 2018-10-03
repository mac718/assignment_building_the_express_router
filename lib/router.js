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
  //console.log(Router.routes);

  Router[method] = (path, callback) => {
    let params = {};
    let splitPath = parser.splitPath(path);
    //path = splitPath.map(term => { return '/' + term }).join(''); //.filter(term => {return term[0] != ':';})
    

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
  
  // patterns = patterns.map(pattern => {
  //   return pattern.replace(/:\w+/, new RegExp('\\w+'));
  // })

  path = parser.splitPath(path);
  
  req.params = {};

  patterns.forEach( pattern => {
    pattern = parser.splitPath(pattern);
    if( pattern.length != path.length ) {
      return;
    }
    pattern.forEach((term, i) => {
      if (term == path[i]){
        //console.log(path[i]);
      } else if (term[0] == ':' && typeof(path[i]) == 'string'){
        req.params[term.slice(1)] = path[i];
        //Router.routes[method]['/' + pattern.join('/')].params[0][term.slice(1)] = path[i];
        path[i] = term;
      }
    })

  })

  if (path[0] == '/'){
    path = '/';
  } else {
    path = '/' + path.join('/');
  }

  let p = new Promise(resolve => {
    if (method !== 'get') {
      _extractPostData(req, resolve);
    } else {
      resolve();
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