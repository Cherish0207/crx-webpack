(() => {
  var modules = {
    
      "./src/index.js": (module, exports, __webpack_require__) => {
      eval(
        `let str = __webpack_require__("./src/a.js");

console.log(str);`
      );
    },
    
      "./src/a.js": (module, exports, __webpack_require__) => {
      eval(
        `let b = __webpack_require__("./src/base/b.js");

module.exports = "hello " + b;`
      );
    },
    
      "./src/base/b.js": (module, exports, __webpack_require__) => {
      eval(
        `module.exports = "world";`
      );
    },
    
  };
  var cache = {};
  function __webpack_require__(moduleId) {
    var cachedModule = cache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (cache[moduleId] = {
      exports: {},
    });
    modules[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
  }
  var exports = __webpack_require__("./src/index.js");
})();
