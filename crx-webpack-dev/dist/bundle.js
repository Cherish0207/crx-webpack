(() => {
  var modules = {
    "./src/a.js": (module, exports, require) => {
      eval(
        'let b = require( "./src/base/b.js");\nmodule.exports = "hello " + b;\n\n\n//# sourceURL=webpack://crx-webpack/./src/a.js?'
      );
    },
    "./src/base/b.js": (module) => {
      eval(
        'module.exports = "world";\n\n\n//# sourceURL=webpack://crx-webpack/./src/base/b.js?'
      );
    },
    "./src/index.js": (module, exports, require) => {
      eval(
        'let str = require( "./src/a.js");\nconsole.log(str);\n\n\n//# sourceURL=webpack://crx-webpack/./src/index.js?'
      );
    },
  };
  var cache = {};
  function require(moduleId) {
    var cachedModule = cache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (cache[moduleId] = {
      exports: {},
    });
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  var exports = require("./src/index.js");
})();
