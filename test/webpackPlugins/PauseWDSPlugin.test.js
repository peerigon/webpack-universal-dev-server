import test from "ava";
import PauseWDSPlugin from "../../lib/webpack/PauseWDSPlugin";
import pauseMiddleware from "../../lib/util/pauseMiddleware";

test("an instance exposes the option object", t => {
    const options = {};
    const plugin = new PauseWDSPlugin(options);

    t.is(plugin.options, options);
});

test("an instance provides an apply() method", t => {
    const plugin = new PauseWDSPlugin();

    t.is(typeof plugin.apply, "function");
});

test("the apply() method attaches a setup function to the devServer options", t => {
    const plugin = new PauseWDSPlugin();
    const webpackConfig = {};

    plugin.apply({ options: webpackConfig });

    t.truthy(webpackConfig.devServer);
    t.is(typeof webpackConfig.devServer.setup, "function");
});

test("the devServer.setup() function registers the pauseMiddleware", t => {
    const plugin = new PauseWDSPlugin();
    const webpackConfig = {};
    let middleware;

    plugin.apply({ options: webpackConfig });
    webpackConfig.devServer.setup({
        use(arg1) {
            middleware = arg1;
        }
    });
    t.is(middleware, pauseMiddleware);
});

test("the devServer.setup() function calls the original setup function with the app", t => {
    const plugin = new PauseWDSPlugin();
    const fakeApp = { use() {} };
    const webpackConfig = {
        devServer: { setup }
    };
    let app;

    function setup(arg1) {
        app = arg1;
    }

    plugin.apply({ options: webpackConfig });

    // Check if registering has worked correctly
    t.not(webpackConfig.devServer.setup, setup);

    webpackConfig.devServer.setup(fakeApp);

    t.is(app, fakeApp);
});

test("the devServer.setup() function registers the pauseMiddleware first and calls then the original setup function with the app", t => {
    const plugin = new PauseWDSPlugin();
    const callOrder = [];
    const fakeApp = {
        use() {
            callOrder.push("a");
        }
    };
    const webpackConfig = {
        devServer: {
            setup(app) {
                callOrder.push("b");
            }
        }
    };

    plugin.apply({ options: webpackConfig });
    webpackConfig.devServer.setup(fakeApp);

    t.is(callOrder.join(""), "ab");
});
