// @flow

import type { ChildProcess } from "child_process";
import { fork } from "child_process";
import argv from "../argv";

const pathToWp = require.resolve("webpack");

export default function forkWpWatchProcess(): ChildProcess {
    return fork(
        pathToWp,
        ["--config", argv.config, "--watch"],
        {
            env: Object.assign({}, process.env, { WEBPACK_TARGET: "node" })
        }
    );
}
