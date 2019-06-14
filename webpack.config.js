// webpack v4
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = (env, argv) => {
  process.env.BABEL_ENV = argv.mode;

  console.log('mode ', argv.mode);

  const config = {
    devtool: "source-map",
    entry: "./src/main.js",
    output: {
      publicPath: "/",
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js"
    },
    module: {
      rules: [
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            "file-loader",
            {
              loader: "image-webpack-loader",
            }
          ]
        },
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
          resolve: {
            extensions: [".js"]
          }
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: { importLoaders: 1, sourceMap: true }
              },
              "postcss-loader"
            ]
          })
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",

            use: [
              { loader: "css-loader" },
              { loader: "postcss-loader" },
              { loader: "sass-loader" }
            ]
          })
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin({ filename: "css/[name].css" }),
      new webpack.HotModuleReplacementPlugin(),
      new HtmlPlugin({ filename: "index.html", template: "src/assets/index.html" }),
    ],
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization"
      }
    }
  };

  return config;
};
