const fs = require('fs');
const path = require('path');

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
  }
  // 发射打包后的文件
  emitFile() {}
  getSource(modulePath) {
    return fs.readFileSync(modulePath, 'utf8');
  }
}
module.exports = Compile;
