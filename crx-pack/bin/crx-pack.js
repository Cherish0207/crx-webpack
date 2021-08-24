#! /usr/bin/env node
let path = require('path');

// 1.找到当前命令的执行路径,拿到webpack.config.js
let config = require(path.resolve('./webpack.config.js'));
let Compiler = require('../lib/Compiler.js');

let compiler = new Compiler(config);
compiler.hooks.entryOption.call();
compiler.run(); // 标识运行编译
