// @flow

import { existsSync } from "fs";
import type {
    PromisedWebpackOptions,
    WebpackConfigGetterArgs, WebpackConfigExport, WebpackConfigGetter,
} from "../../types";
import { WUDSError } from "../../util/error";

const loadConfig = (
    configPath: string
): WebpackConfigExport => {
    if (existsSync(configPath) === false) {
        throw new WUDSError(`Cannot find webpack config at ${ configPath }`);
    }

    // The following dynamic import is ok since we want to load
    // the given webpack config as a regular node module
    return require(configPath); // eslint-disable-line import/no-dynamic-require
};
const getConfigGetter = (
    configPath: string,
    configModuleExport: WebpackConfigExport = loadConfig(configPath)
): WebpackConfigGetter => {
    if (configModuleExport &&
        typeof configModuleExport.default === "function") {
        return configModuleExport.default;
    }

    if (typeof configModuleExport === "function") {
        return configModuleExport;
    }

    throw new WUDSError(`Webpack config at ${ configPath } does not export a function`);
};

export default (
    configPath: string,
    context?: *,
    args: WebpackConfigGetterArgs,
): PromisedWebpackOptions =>
    Promise
        .resolve() // ensure that we're inside a promise chain
        .then(() => getConfigGetter(configPath).apply(context, args));
