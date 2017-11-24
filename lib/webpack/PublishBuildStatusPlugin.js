// @flow

import type { MessageHandler, WpCompilationMessage, WpDoneMessage, WebpackCompiler, WebpackStats } from "../types";
import { wpCompilation, wpDone } from "../messages";
import { throwError } from "../util/error";

type PublishBuildStatusPluginOptions = {
    +publisher: string,
    +publish: MessageHandler<WpCompilationMessage | WpDoneMessage>
};

const checkPublisher = (
    publisher?: *
): void =>
    void (
        (typeof publisher === "undefined" || publisher === null || publisher === "") &&
        throwError(new Error("No publisher id given"))
    );
const checkPublish = (
    publish?: *
): void =>
    void (
        (typeof publish !== "function") &&
        throwError(new Error("No publish function given"))
    );
const onCompilation = (
    plugin: PublishBuildStatusPlugin
) => (
): void =>
    void (
        plugin.options.publish(
            wpCompilation(plugin.options.publisher)
        )
    );
const onDone = (
    plugin: PublishBuildStatusPlugin
) => (
    stats: WebpackStats
): void =>
    void (
        plugin.options.publish(
            wpDone(plugin.options.publisher, stats)
        )
    );

export default class PublishBuildStatusPlugin {
    options: PublishBuildStatusPluginOptions

    constructor(options: PublishBuildStatusPluginOptions): void {
        return void (
            checkPublish(options.publish),
            checkPublisher(options.publisher),
            (this.options = options)
        );
    }

    apply(compiler: WebpackCompiler): void {
        return void (
            compiler.plugin("compilation", onCompilation(this)),
            compiler.plugin("done", onDone(this))
        );
    }
}
