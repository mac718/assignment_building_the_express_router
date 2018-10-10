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

module.exports = parser;