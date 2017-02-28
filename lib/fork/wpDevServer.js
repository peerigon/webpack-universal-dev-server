// @flow

import type { ChildProcess } from "child_process";
import { fork } from "child_process";
import argv from "../argv";

const pathToWpDevServerBin = require.resolve(".bin/webpack-dev-server");

export default function forkWpDevServer(): ChildProcess {
    return fork(
        pathToWpDevServerBin, ["--config", argv.config, "--hot"],
        {
            env: Object.assign({}, process.env, { WEBPACK_TARGET: "web" }),
            silent: false
        }
    );
}
