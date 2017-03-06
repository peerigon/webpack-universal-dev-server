// @flow

import type { ChildProcess } from "child_process"
import { fork } from "child_process"
import process from "../processes/main"

const pathToWpDevServerBin = require.resolve(".bin/webpack-dev-server")

export default (
): ChildProcess =>
    fork(
        pathToWpDevServerBin, ["--config", process.argv.config, "--hot"],
        {
            env: Object.assign({}, process.env, { WEBPACK_TARGET: "web" }),
            silent: false
        }
    )
