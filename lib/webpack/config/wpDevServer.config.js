// @flow

import type {
    WebpackOptions, PromisedWebpackOptions, WebpackConfigGetterArgs,
} from "../../types";
import load from "./load";
import { extendPlugins, extendDevServer } from "./extend";
import process from "../../processes/wpDevServer";

const extend = (
    webpackConfig: WebpackOptions
): WebpackOptions => {
    void extendPlugins(
        process.send,
        process.env.WUDS_PUBLISHER,
        webpackConfig
    );
    void extendDevServer(webpackConfig);

    return webpackConfig;
};

export default function captureThis(
    ...args: WebpackConfigGetterArgs
): PromisedWebpackOptions {
    return load(process.env.WUDS_WP_CONFIG_PATH, this, args) // eslint-disable-line no-invalid-this
        .then(extend);
}
