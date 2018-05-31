var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: {
    desktop: "./src/index.jsx",
    app: "./src/mobileApp/index.jsx"
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name]-bundle.js"
  },
  devtool: "source-map",
  devServer: {
    contentBase: "./dist",
    port: 9000
  },
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
      }
    ]
  }
};
