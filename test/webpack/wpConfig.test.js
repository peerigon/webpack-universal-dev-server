import { resolve } from "path";
import test from "ava";
import { WP_CONFIG_PATH, PUBLISHER } from "../../lib/env";
import wpConfig from "../../lib/webpack/wpConfig";
import PublishBuildStatusPlugin from "../../lib/webpack/PublishBuildStatusPlugin";
import devServerSetup from "../../lib/webpack/devServerSetup";

process.env[PUBLISHER] = "test";

function loadWpConfig(name) {
    const configPath = resolve(__dirname, `../fixtures/wpConfigs/${ name }.js`);

    delete require.cache[configPath];
    process.env[WP_CONFIG_PATH] = configPath;

    return wpConfig();
}

test("should load a regular CommonJS module", t => {
    const config = loadWpConfig("cjs");

    t.true(config.commonJs);
});

test("should load a babelfied ES2015 module", t => {
    const config = loadWpConfig("babel");

    t.true(config.babel);
});

test("should throw an error if the path does not exist", t => {
    t.throws(
        () => loadWpConfig("does-not-exist"),
        /Cannot find webpack config at/
    );
});

test("should not catch config runtime errors", t => {
    t.throws(
        () => loadWpConfig("error"),
        /This config throws an error/
    );
});

test("should throw an error if the config does not export a function", t => {
    t.throws(
        () => loadWpConfig("empty"),
        /Webpack config at .+ does not export a function/
    );
    t.throws(
        () => loadWpConfig("object"),
        /Webpack config at .+ does not export a function/
    );
});

test("should throw an error if process.send is not defined", t => {
    const send = process.send;

    delete process.send;

    t.throws(
        () => loadWpConfig("cjs"),
        /Seems like process\.send is not a function: .+ must be executed inside a child_process\.fork()/
    );

    process.send = send;
});

test("should throw an error if a publisher is not defined", t => {
    const publisher = process.env[PUBLISHER];

    delete process.env[PUBLISHER];

    t.throws(
        () => loadWpConfig("cjs"),
        /Seems like .+ is not defined on process\.env: You need to specify a publisher id when creating the child_process/
    );

    process.env[PUBLISHER] = publisher;
});

test("should add an instance of the PublishBuildStatusPlugin with the correct options", t => {
    const send = process.send;
    let givenArgs;
    let ctx;

    process.send = function (...args) {
        givenArgs = args;
        ctx = this;
    };

    const config = loadWpConfig("cjs");
    const instance = config.plugins[0];

    t.true(instance instanceof PublishBuildStatusPlugin);
    t.is(instance.options.publisher, "test");
    instance.options.publish("a", "b", "c");
    t.is(ctx, process);
    t.is(givenArgs.join(""), "abc");

    process.send = send;
});

test("should not remove other plugins", t => {
    const config = loadWpConfig("withPlugins");
    const instance = config.plugins[config.plugins.length - 1];

    t.is(config.plugins.length, 3);
    t.true(instance instanceof PublishBuildStatusPlugin);
});

test("should add a devServer.setup function", t => {
    const config = loadWpConfig("cjs");
    const devServerSetupFn = devServerSetup();

    // Compare source code
    t.is(config.devServer.setup.toString(), devServerSetupFn.toString());
});

test("should not change the original devServer config", t => {
    const config = loadWpConfig("withDevServer");
    const app = {
        use: () => {}
    };

    t.is(config.devServer.port, 1337);
    t.is(config.devServer.setup(app), app);
    t.true(config.devServer.setupCalled);
});
