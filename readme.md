## 手写 webpack

> 通过 webpack 打包出来的结果,自己实现一个 webpack

- 此时在 node 环境下可执行,如何让项目在浏览器中执行?--webpack
  · 将此项目在 webpack 打包,打包后即可运行在浏览器
  · 初始化项目,新建 webpack.config.js

思路步骤

- 自己实现了一个 require 方法,默认引用主文件 src/index.js,
- 在执行的时候传入一个 modules 对象,key 是当前文件的相对路径,value 是文件的代码块
- 通过 eval 执行代码块,执行时如果代码块里面再有 require,就去依次执行加载

## npm link

```bash
cd crx-pack
npm link

cd crx-webpack-dev
npm link crx-pack
npx crx-pack
```

## ast 解析

babylon: 把源码转换成 ast
@babel/traverse:遍历对应节点
@babel/types:把遍历好的节点替换一下
@babel/generator:生成遍历好的结果

```bash
cd crx-pack
npm i babylon @babel/traverse @babel/types @babel/generator -D
```

### ejs 生成打包结果

```bash
cd crx-pack
npm i ejs -D
```
