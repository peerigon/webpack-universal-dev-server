// @flow

import chalk from "chalk";

type AttemptWhatResult = *;

type AttemptOnErrorResult = *;

type AttemptArgs = {
    +what: () => AttemptWhatResult,
    +onError: (e: Error) => AttemptOnErrorResult
};

export class WUDSError extends Error {
    // the super() call cannot be placed inside the void operator, at least with babel
    constructor(message: string): void { // eslint-disable-line max-statements
        super(chalk.red.bold(message));

        return void (
            this.name = "WUDSError"
        );
    }
}

// TODO: Remove this nonsense
export const throwError = (e: Error) => {
    throw e;
};

// TODO: Remove this nonsense
// this is not expressable with just one statement
export const attempt = ({ // eslint-disable-line max-statements
    what,
    onError,
}: AttemptArgs): (AttemptWhatResult | AttemptOnErrorResult) => {
    try {
        return what();
    } catch (e) {
        return onError(e);
    }
};
