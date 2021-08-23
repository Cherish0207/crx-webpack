const fs = require('fs');
const path = require('path');
const babylon = require('babylon');
const t = require('@babel/types');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;

class Compile {
  constructor(config) {
    this.config = config;
    this.entryId; // 保存入口文件的路径
    this.modules = {}; // 保存所有的模块依赖
    this.entry = config.entry;
    this.root = process.cwd();
  }
  run() {
    this.buildModule(path.resolve(this.root, this.entry), true);
    this.emitFile();
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
    console.log('sourceCode---', sourceCode, dependencies);
    this.modules[relativePath] = sourceCode;
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
  emitFile() {}
  getSource(modulePath) {
    return fs.readFileSync(modulePath, 'utf8');
  }
}
module.exports = Compile;
