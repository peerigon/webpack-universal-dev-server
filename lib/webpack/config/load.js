// @flow

import { existsSync } from "fs"
import type { WebpackOptions } from "../../types"
import { throwError, WUDSError } from "../../util/error"

type AnyArgs = Array<any>
type PromisedWebpackOptions = Promise<WebpackOptions>
type ConfigGetterResult = WebpackOptions | PromisedWebpackOptions
type ConfigGetter = (...args: AnyArgs) => ConfigGetterResult
type ConfigModuleExport = ConfigGetter | {
    +default: ConfigGetter
}

const loadConfig = (
    configPath: string
): ConfigModuleExport =>
    // The following dynamic import is ok since we want to load
    // the given webpack config as a regular node module
    (existsSync(configPath) && require(configPath)) || // eslint-disable-line import/no-dynamic-require
    throwError(new WUDSError(`Cannot find webpack config at ${ configPath }`))

const getConfigGetter = (
    configPath: string,
    configModuleExport: ConfigModuleExport = loadConfig(configPath)
): ConfigGetter =>
    (
        configModuleExport &&
        typeof configModuleExport.default === "function" &&
        configModuleExport.default
    ) ||
    (
        typeof configModuleExport === "function" && configModuleExport
    ) ||
    throwError(new WUDSError(`Webpack config at ${ configPath } does not export a function`))

export default (
    configPath: string,
    context: any,
    args: AnyArgs,
): PromisedWebpackOptions =>
    Promise
        .resolve() // ensure that we're inside a promise chain
        .then(() => getConfigGetter(configPath))
        .then(getter => getter.apply(context, args))
