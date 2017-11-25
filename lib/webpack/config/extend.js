// @flow

import type {
    WebpackOptions, WebpackDevServerOptions,
    WpMessageHandler,
} from "../../types";
import PublishBuildStatusPlugin from "../PublishBuildStatusPlugin";
import devServerSetup from "./devServerSetup";

export const extendPlugins = (
    publish: WpMessageHandler,
    publisher: string,
    webpackConfig: WebpackOptions
): void => {
    webpackConfig.plugins = [
        ...(webpackConfig.plugins || []),
        new PublishBuildStatusPlugin({
            publish,
            publisher,
        }),
    ];
};

export const extendDevServer = (
    webpackConfig: WebpackOptions
): void => {
    const oldDevServerConfig: WebpackDevServerOptions = webpackConfig.devServer || {};

    webpackConfig.devServer = {
        ...oldDevServerConfig,
        setup: devServerSetup(oldDevServerConfig.setup),
    };
};
