// @flow

import type { ChildProcess } from "child_process";
import { fork } from "child_process";
import argv from "../argv";

const pathToWpDevServer = require.resolve("webpack-dev-server");

export default function forkWpDevServer(): ChildProcess {
    return fork(
        pathToWpDevServer,
        ["--config", argv.config, "--hot"],
        {
            env: Object.assign({}, process.env, { WEBPACK_TARGET: "web" })
        }
    );
}
