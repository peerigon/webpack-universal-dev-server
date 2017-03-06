// @flow

import type {
    WebpackOptions, WebpackDevServerOptions,
    WpMessageHandler
} from "../../types"
import PublishBuildStatusPlugin from "../PublishBuildStatusPlugin"
import devServerSetup from "./devServerSetup"

export const extendPlugins = (
    publish: WpMessageHandler,
    publisher: string,
    webpackConfig: WebpackOptions,
): void =>
    void (
        webpackConfig.plugins = [
            ...(webpackConfig.plugins || []),
            new PublishBuildStatusPlugin({
                publish,
                publisher
            })
        ]
    )

export const extendDevServer = (
    webpackConfig: WebpackOptions,
    oldDevServerConfig: WebpackDevServerOptions = webpackConfig.devServer || {},
    newDevServerConfig: WebpackDevServerOptions = {}
): void =>
    void (
        webpackConfig.devServer = (
            Object.assign(newDevServerConfig, oldDevServerConfig),
            (newDevServerConfig.setup = devServerSetup(
                typeof oldDevServerConfig.setup === "function" ?
                oldDevServerConfig.setup : undefined // eslint-disable-line no-undefined
            )),
            newDevServerConfig
        )
    )
