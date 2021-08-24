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
  resolveLoader: {
    modules: ["node_modules", path.resolve(__dirname, "loader")],
    // alias: {
    //   "style-loader": path.resolve(__dirname, "loader", "style-loader"),
    //   "less-loader": path.resolve(__dirname, "loader", "less-loader"),
    // },
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: {
          loader: "less-loader",
        },
      },
      {
        test: /\.less$/,
        use: {
          loader: "style-loader",
        },
        enforce: "post", // post
      },
    ],
  },
  plugins: [new P()],
};
