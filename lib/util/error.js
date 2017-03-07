// @flow

import chalk from "chalk"

type AttemptArgs = {
    +what: () => any,
    +onError: (e: Error) => any
}

export class WUDSError extends Error {
    // the super() call cannot be placed inside the void operator, at least with babel
    constructor(message: string): void { // eslint-disable-line max-statements
        super(chalk.red.bold(message))

        return void (
            this.name = "WUDSError"
        )
    }
}

export function throwError(e: Error) {
    throw e
}

// this is not expressable with just one statement
export function attempt({ // eslint-disable-line max-statements
    what,
    onError
}: AttemptArgs): any {
    try {
        return what()
    } catch (e) {
        return onError(e)
    }
}