var parser = {
  splitPath: (path) => {
    let splitPath;
    if (path == '/') {
      splitPath = ['/'];
    } else {
      splitPath = path.split('/').slice(1);
    }
    return splitPath;
  }
}

//console.log(parser.getParams('/butts/:name/:thing'));
module.exports = parser;