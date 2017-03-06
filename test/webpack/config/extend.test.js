import test from "ava"
import { extendPlugins, extendDevServer } from "../../../lib/webpack/config/extend"
import PublishBuildStatusPlugin from "../../../lib/webpack/PublishBuildStatusPlugin"
import devServerSetup from "../../../lib/webpack/config/devServerSetup"

const hasOwnProperty = Object.prototype.hasOwnProperty

test("extendPlugins should add the PublishBuildStatusPlugin with the given options", t => {
    const publish = () => {}
    const publisher = __filename
    const webpackConfig = {}

    extendPlugins(publish, publisher, webpackConfig)

    t.deepEqual(webpackConfig.plugins, [
        new PublishBuildStatusPlugin({ publish, publisher })
    ])
})

test("extendPlugins should not remove plugins", t => {
    const publish = () => {}
    const publisher = __filename
    const pluginA = {}
    const pluginB = {}
    const pluginC = {}
    const webpackConfig = {
        plugins: [
            pluginA, pluginB, pluginC
        ]
    }

    extendPlugins(publish, publisher, webpackConfig)

    const plugins = webpackConfig.plugins.slice()

    t.is(plugins.length, 4)

    plugins.length = 3

    t.deepEqual(plugins, [
        pluginA, pluginB, pluginC
    ])
})

test("extendDevServer should add a devServer property with our setup function", t => {
    const devServerSetupFn = devServerSetup()
    const webpackConfig = {}

    extendDevServer(webpackConfig)

    t.true(hasOwnProperty.call(webpackConfig, "devServer"))
    // Compare source code
    t.is(webpackConfig.devServer.setup.toString(), devServerSetupFn.toString())
})

test("extendDevServer should not remove properties from a previous devServer config", t => {
    const devServer = { a: 1, b: 2, c: 3 }
    const expectedKeys = Object.keys(devServer)
    const webpackConfig = {
        devServer
    }

    extendDevServer(webpackConfig)

    t.true(
        expectedKeys.every(hasOwnProperty, webpackConfig.devServer)
    )
})

test("extendDevServer should not remove the original setup function", t => {
    let args
    let ctx
    const expectedReturn = {}
    const webpackConfig = {
        devServer: {
            setup(...a) {
                args = a
                ctx = this

                return expectedReturn
            }
        }
    }
    const app = {
        use: () => {}
    }

    extendDevServer(webpackConfig)

    const actualReturn = webpackConfig.devServer.setup(app, 1, 2, 3)

    t.deepEqual(args, [app, 1, 2, 3])
    t.is(ctx, webpackConfig.devServer)
    t.is(actualReturn, expectedReturn)
})
