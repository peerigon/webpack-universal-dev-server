// @flow

import type { ChildProcess } from "child_process";
import { fork } from "child_process";
import argv from "../argv";

const pathToWpBin = require.resolve(".bin/webpack");

export default function forkWpWatchProcess(): ChildProcess {
    return fork(
        pathToWpBin, ["--config", argv.config, "--watch"],
        {
            env: Object.assign({}, process.env, { WEBPACK_TARGET: "node" }),
            silent: false
        }
    );
}
