// @flow

import { EOL } from "os";
import chalk from "chalk";

const separator = "---------------------------------------------------------------------------------------";
const finished = (
    what: string
): string =>
    chalk.green(`${ what } finished`);
const formatDuration = (
    duration: number
): string =>
    (duration / 1000).toFixed(1);

export const buildStarted = (
    what: string
): string =>
    `${ chalk.yellow(what) } started...`;

export const buildSuccess = (
    what: string,
    duration: number
): string =>
    `${ finished(what) } after ${ formatDuration(duration) }s`;

export const buildError = (
    what: string,
    error: string
): string =>
    [
        "",
        separator,
        chalk.red(`${ what } error`),
        separator,
        "",
        error,
        "",
        separator,
    ].join(EOL);
