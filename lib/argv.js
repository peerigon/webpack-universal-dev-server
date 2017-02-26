// @flow

import path from "path";
import chalk from "chalk";
import fs from "fs";
import yargs from "yargs";
import WUDSError from "./util/WUDSError";

function clarifyError(path, what, err): Error {
    switch (err.code) {
        case "ENOENT":
            return new WUDSError(`Path to ${ what } does not exist: ${ path }`);
        default:
            return err;
    }
}

export default yargs
    .usage(`${ chalk.bold("Usage:") } $0 -a ${ chalk.dim("./app.js") } -c ${ chalk.dim("./webpack.config.js") } -- ${ chalk.dim("./webpack.config.js") }`)
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
    .wrap(null)
    .help()
    .argv;
