const url = require('url');
const parser = require('./parser');

var Router = {
  methods: ['get', 'post'],

  routes: {}
}

Router.methods.forEach(method => {
  Router.routes[method] = Router.routes[method] || {};
  //console.log(Router.routes);

  Router[method] = (path, callback) => {
    let params = {};
    let splitPath = parser.splitPath(path);
    //path = splitPath.map(term => { return '/' + term }).join(''); //.filter(term => {return term[0] != ':';})
    

    let pathParams = splitPath.filter(param => {
      return param[0] == ':';
    }).map(param => {
      params[param.slice(1)] = '';
      return params;
    })

    Router.routes[method][path] = {callback: callback, params: pathParams};
  }
})

Router.handle = (req, res) => {
  var method = req.method.toLowerCase();

  var path = url.parse(req.url).pathname;

  let patterns = Object.keys(Router.routes[method]);
  
  // patterns = patterns.map(pattern => {
  //   return pattern.replace(/:\w+/, new RegExp('\\w+'));
  // })

  path = parser.splitPath(path);
  console.log(path);
  console.log(patterns);
  req.params = {};

  patterns.forEach(pattern => {
    pattern = parser.splitPath(pattern);
    if(pattern.length != path.length) {
      return;
    }
    pattern.forEach((term, i) => {
      if (term == path[i]){
        //console.log(path[i]);
      } else if (term[0] == ':' && typeof(path[i]) == 'string'){
        req.params[term.slice(1)] = path[i];
        Router.routes[method]['/' + pattern.join('/')].params[0][term.slice(1)] = path[i];
        path[i] = term;
      }
    })

  })

  path = '/' + path.join('/');
  console.log(path);


  if (Router.routes[method][path]) {
    Router.routes[method][path].callback(req, res);
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
}



module.exports = Router;