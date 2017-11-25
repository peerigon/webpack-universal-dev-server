// @flow

import path from "path";
import chalk from "chalk";
import fs from "fs";
import yargs from "yargs";
import type { Argv } from "../../types";
import { WUDSError } from "../../util/error";

type NodeError = Error & {
    code?: string
};

const clarifyError = (
    path: string,
    what: string,
    err: NodeError
): Error => {
    switch (err.code) {
        case "ENOENT":
            return new WUDSError(`Path to ${ what } does not exist: ${ path }`);
        default:
            return err;
    }
};
const coerceApp = (
    appPath: string
): string => {
    try {
        return fs.realpathSync(appPath);
    } catch (err) {
        throw clarifyError(appPath, "application server executable", err);
    }
};
const coerceConfig = (
    configPath: string
): string => {
    try {
        return fs.realpathSync(configPath);
    } catch (err) {
        throw clarifyError(configPath, "webpack config", err);
    }
};
const argv: Argv = yargs
    .usage(`${ chalk.bold("Usage:") } $0 -a ${ chalk.dim("./app.js") } -c ${ chalk.dim("./webpack.config.js") } -- ${ chalk.dim("./webpack.config.js") }`)
    .option("app", {
        describe: "Path to the application server executable",
        default: path.join(process.cwd(), "bin", "www"), // This is express.js' default
        coerce: coerceApp,
        alias: "a",
    })
    .option("config", {
        describe: "Path to webpack.config.js",
        default: path.join(process.cwd(), "webpack.config.js"),
        coerce: coerceConfig,
        alias: "c",
    })
    .wrap(null)
    .help()
    .argv;

export default argv;
