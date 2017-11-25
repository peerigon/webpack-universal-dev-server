// @flow

import chalk from "chalk";

export class WUDSError extends Error {
    constructor(message: string): void {
        super(chalk.red.bold(message));

        this.name = "WUDSError";
    }
}
