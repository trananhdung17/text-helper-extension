const path = require("path");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: "./src/index.tsx",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: { noEmit: false },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      // {
      //   test: /\.scss$/,
      //   use: ["style-loader", "scss-loader"],
      // },
      {
        test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        loader: "url-loader"
      }
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "content_scripts.js",
    path: path.resolve(__dirname, "extension"),
    publicPath: '/'
  },
  plugins: [
    // Copy mọi files trong folder public trừ file index.html
    new CopyPlugin({
      patterns: [
        {
          from: "public",
          to: "."
        },
      ],
    }),
    // Plugin hỗ trợ thêm thẻ style và script vào index.html
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, "public", "index.html"),
    //   filename: "index.html",
    // }),
  ],
};
