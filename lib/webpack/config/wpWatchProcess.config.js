// @flow

import type {
    WebpackOptions, PromisedWebpackOptions, WebpackConfigGetterArgs
} from "../../types"
import load from "./load"
import { extendPlugins } from "./extend"
import process from "../../processes/wpWatchProcess"

const extend = (
    webpackConfig: WebpackOptions
): WebpackOptions =>
    (
        extendPlugins(
            process.send,
            process.env.WUDS_PUBLISHER,
            webpackConfig
        ),
        webpackConfig
    )

export default function ( // function because we need to capture `this`
    ...args: WebpackConfigGetterArgs
): PromisedWebpackOptions {
    return load(process.env.WUDS_WP_CONFIG_PATH, this, args) // eslint-disable-line no-invalid-this
        .then(extend)
}
