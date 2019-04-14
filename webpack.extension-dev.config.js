var path = require("path");
var webpack = require("webpack");

module.exports = env => {
  return {
    mode: "development",
    watch: true,
    entry: {
      content: "./src/extension/content.js",
      background: "./src/extension/background.js"
    },
    output: {
      path: path.join(__dirname, "extension"),
      filename: "[name].js"
    },
    devtool: "source-map",
    plugins: [
      new webpack.DefinePlugin({
        FIREBASE_KEY: JSON.stringify(env.FIREBASE_KEY)
      })
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loaders: ["babel-loader"],
          include: path.join(__dirname, "src")
        },
        {
          test: /\.css$/,
          loaders: ["style-loader", "css-loader?modules"]
        },
        {
          test: /\.(png)$/,
          loader: "file-loader",
          options: {
            name: "[name].[ext]"
          }
        }
      ]
    }
  };
};
