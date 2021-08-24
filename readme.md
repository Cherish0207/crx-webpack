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

## loader

webpack 只能处理 Javascript 的模块,\
如果要要处理其他类型的文件,需要使用 loader 进行转换。\
loader 是 webpack 一个重要的概念,指用来将一段代码转換成另一段代码的 webpack 加载器。

写一个简单的 loader\
在根目录下创建 loaders 文件夹,增加 loader 文件,
loaders 就是一个函数,参数是匹配到文件的内容,返回结果会作为最新的内容

```bash
cd crx-webpack-dev
npm i less -D
```

loader 的载入方式\
1.直接写成绝对路径\
2.可以配置别名\
3.配置 resolveLoader 的 modules \
4.可以直接放在 node_modules 中 \
5.npm link 的方式\

配置多个 loader 的默认执行顺序是:从下到上,从右向左\

loader 的分类
前置 loader:pre
普通 loader:normal
后置 loader: post

loader 的顺序:pre+normal+inline +post

## 插件

```bash
cd crx-pack
npm i tapable
```
