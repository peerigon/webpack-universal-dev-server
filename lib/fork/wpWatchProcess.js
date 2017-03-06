// @flow

import type { ChildProcess } from "child_process"
import { fork } from "child_process"
import process from "../processes/main"

const pathToWpBin = require.resolve(".bin/webpack")

export default (
): ChildProcess =>
    fork(
        pathToWpBin, ["--config", process.argv.config, "--watch"],
        {
            env: Object.assign({}, process.env, { WEBPACK_TARGET: "node" }),
            silent: false
        }
    )
