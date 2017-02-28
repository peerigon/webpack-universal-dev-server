"use strict";

const path = require("path");

module.exports = {
    entry: require.resolve("./lib/entry.js"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    module: {
        rules: [{
            test: /\.js$/,
            loaders: [{
                loader: "babel-loader"
            }]
        }]
    }
};
