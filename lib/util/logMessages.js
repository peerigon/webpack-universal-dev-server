// @flow

import { EOL } from "os";
import chalk from "chalk";

const separator = "---------------------------------------------------------------------------------------";

export function buildStarted(what: string): string {
    return `${ chalk.yellow(what) } started...`;
}

export function buildSuccess(what: string, duration: number): string {
    const green = chalk.green(`${ what } finished`);

    return `${ green } after ${ (duration / 1000).toFixed(1) }s`;
}

export function buildError(what: string, error: string): string {
    return [
        "",
        separator,
        chalk.red(`${ what } error`),
        separator,
        "",
        error,
        "",
        separator
    ].join(EOL);
}
