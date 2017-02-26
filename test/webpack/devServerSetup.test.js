import test from "ava";
import devServerSetup from "../../lib/webpack/devServerSetup";
import pauseMiddleware from "../../lib/util/pauseMiddleware";

test("returns a function that registers the pauseMiddleware on the app", t => {
    const setup = devServerSetup();
    const app = {
        use(arg) {
            middleware = arg;
        }
    };
    let middleware;

    setup(app);

    t.is(middleware, pauseMiddleware);
});

test("calls the original setup function with all arguments when given", t => {
    const o2 = {};
    const o3 = {};
    const setup = devServerSetup((a1, a2, a3) => {
        t.is(a1, app);
        t.is(a2, o2);
        t.is(a3, o3);
        called = true;
    });
    const app = {
        use: () => {}
    };
    let called = true;

    // We pass in more arguments than usual to test for future compatibility
    setup(app, o2, o3);

    t.true(called);
});

test("registers the pauseMiddleware before calling the original setup", t => {
    const order = [];
    const setup = devServerSetup(() => order.push("b"));
    const app = {
        use: () => {
            order.push("a");
        }
    };

    // We pass in more arguments than usual to test for future compatibility
    setup(app);

    t.is(order.join(""), "ab");
});
