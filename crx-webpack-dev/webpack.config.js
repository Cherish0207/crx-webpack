const path = require("path");
class P {
  apply(compiler) {
    // console.log('start', compiler);
    compiler.hooks.emit.tap("emit", function () {
      console.log("emit ");
    });
  }
}
module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          path.resolve(__dirname, "loader", "style-loader"), // 绝对路径的写法
          path.resolve(__dirname, "loader", "less-loader"),
        ],
      },
    ],
  },
  plugins: [new P()],
};
