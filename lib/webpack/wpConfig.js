// @flow

import type { WebpackOptions } from "../types";
import { existsSync } from "fs";
import { basename } from "path";
import WUDSError from "../util/WUDSError";
import PublishBuildStatusPlugin from "../webpack/PublishBuildStatusPlugin";
import devServerSetup from "../webpack/devServerSetup";
import { get, WP_CONFIG_PATH, PUBLISHER } from "../env";

function extend(webpackConfig: WebpackOptions): WebpackOptions {
    const publisher = get(PUBLISHER);
    const devServer = Object.assign({}, webpackConfig.devServer);
    const plugins = webpackConfig.plugins || [];
    const publish: Function | false = typeof process.send === "function" ?
        process.send.bind(process) : false;

    if (publish === false) {
        throw new WUDSError(`Seems like process.send is not a function: ${ basename(__filename) } must be executed inside a child_process.fork()`);
    }
    if (!publisher) {
        throw new WUDSError(`Seems like ${ PUBLISHER } is not defined on process.env: You need to specify a publisher id when creating the child_process`);
    }

    devServer.setup = devServerSetup(
        typeof devServer.setup === "function" ?
            devServer.setup.bind(devServer) :
            undefined // eslint-disable-line no-undefined
    );

    return {
        ...webpackConfig,
        plugins: [
            ...plugins,
            new PublishBuildStatusPlugin({
                publish,
                publisher
            })
        ],
        devServer
    };
}

export default function wpConfig() {
    const configPath = get(WP_CONFIG_PATH);

    if (existsSync(configPath) === false) {
        throw new WUDSError(`Cannot find webpack config at ${ configPath }`);
    }

    // @flow ignore-dynamic-require
    const configExport = require(configPath);
    const configFn = configExport.default ? configExport.default : configExport;

    if (typeof configFn !== "function") {
        throw new WUDSError(`Webpack config at ${ configPath } does not export a function`);
    }

    return extend(
        configFn.apply(this, arguments) // eslint-disable-line no-invalid-this
    );
}
