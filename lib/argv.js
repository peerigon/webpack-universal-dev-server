// @flow

import path from "path";
import fs from "fs";
import yargs from "yargs";

function clarifyError(path, toWhat, err): Error {
    switch (err.code) {
        case "ENOENT":
            return new Error(`Path to ${ toWhat } does not exist: ${ path }`);
        default:
            return err;
    }
}

export default yargs
    .option("app", {
        describe: "Path to the application server executable",
        default: path.join(process.cwd(), "bin", "www"), // This is express.js' default
        coerce(appPath) {
            try {
                return fs.realpathSync(appPath);
            } catch (err) {
                throw clarifyError(appPath, "application server executable", err);
            }
        },
        alias: "a"
    })
    .option("app-args", {
        describe: "Arguments to be passed to the application server executable",
        default: ""
    })
    .option("config", {
        describe: "Path to webpack.config.js",
        default: path.join(process.cwd(), "webpack.config.js"),
        coerce(configPath) {
            try {
                return fs.realpathSync(configPath);
            } catch (err) {
                throw clarifyError(configPath, "webpack config", err);
            }
        },
        alias: "c"
    })
    .help()
    .argv;
