// @flow

import type { ChildProcess } from "child_process";
import { fork } from "child_process";
import process from "../processes/main";

export default (
): ChildProcess =>
    fork(
        process.argv.app,
        [process.argv.appArgs], // appArgs is a string, but fork does only accept arrays
        {
            env: Object.assign({}, process.env),
        }
    );
