import { resolve } from "path"
import test from "ava"
import _load from "../../../lib/webpack/config/load"

const resolveConfig = (
    name
) =>
    resolve(__dirname, `../../fixtures/wpConfigs/${ name }.js`)

const load = (
    configPath,
    context,
    args
) => (
    delete require.cache[configPath],
    _load(configPath, context, args)
)

test("should load a regular CommonJS module", async t => {
    const config = await load(resolveConfig("cjs"))

    t.true(config.commonJs)
})

test("should load a babelfied ES2015 module", async t => {
    const config = await load(resolveConfig("babel"))

    t.true(config.babel)
})

test("should apply the given ctx and args", async t => {
    const args = [1, 2, 3]
    const ctx = {}
    const config = await load(resolveConfig("inspect"), ctx, args)

    t.deepEqual(config.args, args)
    t.is(config.ctx, ctx)
})

test("should reject with an error if the path does not exist", async t => {
    let error = false

    await load("does-not-exist")
        .catch(e => (error = e))

    t.true(/Cannot find webpack config at/
        .test(error.message))
    t.true(new RegExp("does-not-exist")
        .test(error.message))
})

test("should not obscure config runtime errors", async t => {
    let error = false

    await load(resolveConfig("error"))
        .catch(e => (error = e))

    t.true(/This config throws an error/
        .test(error.message))
})

test("should throw an error if the config does not export a function", async t => {
    let error = false

    await load(resolveConfig("empty"))
        .catch(e => (error = e))

    t.true(/Webpack config at .+ does not export a function/
        .test(error.message))
    t.true(new RegExp(resolveConfig("empty"))
        .test(error.message))

    await load(resolveConfig("object"))
        .catch(e => (error = e))
    t.true(/Webpack config at .+ does not export a function/
        .test(error.message))
    t.true(new RegExp(resolveConfig("object"))
        .test(error.message))
})
