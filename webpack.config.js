require("dotenv").config();
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY || "";

const clientConfig = {
  entry: "./src/client.tsx",
  target: "web",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist/public"),
    filename: "bundle.js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.REACT_APP_OPENWEATHER_API_KEY": JSON.stringify(API_KEY),
    }),
  ],
};

const serverConfig = {
  entry: "./src/server/server.tsx",
  target: "node",
  mode: "development",
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "server.js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: "css-loader",
            options: {
              modules: {
                exportOnlyLocals: true,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.'91dd1bafc5cb40aaa80131548250707'": JSON.stringify(API_KEY),
    }),
  ],
};

module.exports = [clientConfig, serverConfig];