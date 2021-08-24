const fs = require('fs');
const path = require('path');
const babylon = require('babylon');
const t = require('@babel/types');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const ejs = require('ejs');
const { SyncHook } = require('tapable');
class Compile {
  constructor(config) {
    this.config = config;
    this.entryId; // 保存入口文件的路径
    this.modules = {}; // 保存所有的模块依赖
    this.entry = config.entry;
    this.root = process.cwd();
    this.hooks = {
      entryOption: new SyncHook(),
      compile: new SyncHook(),
      afterCompile: new SyncHook(),
      afterPlugins: new SyncHook(),
      run: new SyncHook(),
      emit: new SyncHook(),
      done: new SyncHook(),
    };
    let plugins = this.config.plugins
    if(Array.isArray(plugins)) {
      plugins.forEach(plugin=>{
        plugin.apply(this)
      })
    }
    this.hooks.afterPlugins.call();
  }
  run() {
    this.hooks.run.call();
    this.hooks.compile.call();
    this.buildModule(path.resolve(this.root, this.entry), true);
    this.hooks.afterCompile.call();
    // console.log('this.modules:', this.modules);
    // console.log('this.entryId:', this.entryId);
    this.emitFile();
    this.hooks.emit.call();
    this.hooks.done.call();
  }
  /**
   * 执行并创建模块依赖关系
   * @param {*} absolutePath 模块的绝对路径
   * @param {*} isEntry 是否是入口
   */
  buildModule(absolutePath, isEntry) {
    const source = this.getSource(absolutePath);
    let relativePath = './' + path.relative(this.root, absolutePath); // 相对路径
    if (isEntry) {
      this.entryId = relativePath;
    }
    let { sourceCode, dependencies } = this.parse(
      source,
      path.dirname(relativePath)
    );
    this.modules[relativePath] = sourceCode;
    // 副模块递归加载
    dependencies.forEach((dep) => {
      this.buildModule(path.resolve(this.root, dep), false);
    });
  }
  // 解析源码 使用AST解析语法树,进行源码的转译
  parse(source, parentPath) {
    let ast = babylon.parse(source);
    let dependencies = [];
    traverse(ast, {
      CallExpression(p) {
        let node = p.node;
        if (node.callee.name === 'require') {
          node.callee.name = '__webpack_require__';
          let moduleName = node.arguments[0].value;
          moduleName = moduleName + (path.extname(moduleName) ? '' : '.js'); // path.extname判断模块有没有扩展名
          moduleName = './' + path.join(parentPath, moduleName);
          dependencies.push(moduleName);
          node.arguments = [t.stringLiteral(moduleName)];
        }
      },
    });
    let sourceCode = generator(ast).code;
    return { sourceCode, dependencies };
  }
  // 发射打包后的文件
  emitFile() {
    // 输出目录
    let main = path.join(this.config.output.path, this.config.output.filename);
    let templateStr = this.getSource(path.join(__dirname, 'main.ejs'));
    let code = ejs.render(templateStr, {
      entryId: this.entryId,
      modules: this.modules,
    });
    this.assets = {};
    this.assets[main] = code;
    fs.writeFileSync(main, this.assets[main]);
  }
  getSource(modulePath) {
    let content = fs.readFileSync(modulePath, 'utf8');
    let rules = this.config.module.rules;
    for (let i = 0; i < rules.length; i++) {
      const { test, use } = rules[i];
      let len = use.length - 1;
      if (test.test(modulePath)) {
        function normalLoader() {
          let loader = require(use[len--]);
          content = loader(content);
          if (len >= 0) {
            normalLoader();
          }
        }
        normalLoader();
      }
    }
    return content;
  }
}
module.exports = Compile;
