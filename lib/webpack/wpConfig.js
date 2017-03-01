// @flow

import { existsSync } from "fs";
import { basename } from "path";
import type { WebpackOptions } from "../types";
import WUDSError from "../util/WUDSError";
import PublishBuildStatusPlugin from "../webpack/PublishBuildStatusPlugin";
import devServerSetup from "../webpack/devServerSetup";
import { get, WP_CONFIG_PATH, PUBLISHER } from "../env";

function getPublish() {
    if (typeof process.send !== "function") {
        throw new WUDSError(`Seems like process.send is not a function: ${ basename(__filename) } must be executed inside a child_process.fork()`);
    }

    return process.send.bind(process);
}

function getPublisher() {
    const publisher = get(PUBLISHER);

    if (!publisher) {
        throw new WUDSError(`Seems like ${ PUBLISHER } is not defined on process.env: You need to specify a publisher id when creating the child_process`);
    }

    return publisher;
}

function extend(webpackConfig: WebpackOptions): WebpackOptions {
    const publisher = getPublisher();
    const devServer = Object.assign({}, webpackConfig.devServer);
    const plugins = webpackConfig.plugins || [];
    const publish = getPublish();

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

export default function wpConfig(...args: Array<any>) {
    const configPath = get(WP_CONFIG_PATH);

    if (existsSync(configPath) === false) {
        throw new WUDSError(`Cannot find webpack config at ${ configPath }`);
    }

    // The following dynamic import is ok since we want to load the given webpack config as a regular node module
    // @flow ignore-dynamic-require
    const configExport = require(configPath); // eslint-disable-line import/no-dynamic-require
    const configFn = configExport.default ? configExport.default : configExport;

    if (typeof configFn !== "function") {
        throw new WUDSError(`Webpack config at ${ configPath } does not export a function`);
    }

    return extend(
        configFn.apply(this, args) // eslint-disable-line no-invalid-this
    );
}
