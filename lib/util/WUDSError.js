// @flow

import chalk from "chalk";

class WUDSError extends Error {
    constructor(message: string) {
        super(chalk.red.bold(message));
        this.name = "WUDSError";
    }
}

export default WUDSError;
