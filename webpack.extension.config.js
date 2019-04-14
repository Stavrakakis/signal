var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: {
    content: "./src/extension/content.js",
    background: "./src/extension/background.js"
  },
  output: {
    path: path.join(__dirname, "extension"),
    filename: "[name].js"
  },
  devtool: "source-map",
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ["babel-loader"],
        include: path.join(__dirname, "src")
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        loaders: [
          "style-loader",
          "css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]"
        ]
      },
      {
        test: /\.(png|json)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]"
        }
      }
    ]
  }
};
