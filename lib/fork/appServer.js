// @flow

import type { ChildProcess } from "child_process";
import { fork } from "child_process";
import argv from "../argv";

export default function forkAppServer(): ChildProcess {
    return fork(
        argv.app,
        [argv.appArgs], // appArgs is a string, but fork does only accept arrays
        {
            env: Object.assign({}, process.env)
        }
    );
}
