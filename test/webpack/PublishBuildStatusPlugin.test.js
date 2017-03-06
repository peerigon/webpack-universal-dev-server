import test from "ava"
import PublishBuildStatusPlugin from "../../lib/webpack/PublishBuildStatusPlugin"
import { wpCompilation, wpDone } from "../../lib/messages"

test("an instance exposes the option object", t => {
    const options = {
        publisher: "test",
        publish() {}
    }
    const plugin = new PublishBuildStatusPlugin(options)

    t.is(plugin.options, options)
})

test("should throw if no publish function was given", t => {
    const options = {
        publisher: "test"
    }

    t.throws(
        () => new PublishBuildStatusPlugin(options),
        "No publish function given"
    )
})

test("should throw if no publisher id was given", t => {
    const options = {
        publish() {}
    }

    t.throws(
        () => new PublishBuildStatusPlugin(options),
        "No publisher id given"
    )
})

test("an instance provides an apply() method", t => {
    const options = {
        publisher: "test",
        publish() {}
    }
    const plugin = new PublishBuildStatusPlugin(options)

    t.is(typeof plugin.apply, "function")
})

test("the apply() method registers a function for the 'compilation' and the 'done' hook", t => {
    const options = {
        publisher: "test",
        publish() {}
    }
    const plugin = new PublishBuildStatusPlugin(options)
    const hooks = []
    const compiler = {
        plugin(hook, fn) {
            hooks.push(hook)
            t.is(typeof fn, "function")
        }
    }

    plugin.apply(compiler)
    t.deepEqual(hooks, ["compilation", "done"])
})

test("calls publish() on 'compilation' with a wpCompilation message", t => {
    const publisher = "test"
    const options = {
        publisher,
        publish(arg1) {
            message = arg1
        }
    }
    const plugin = new PublishBuildStatusPlugin(options)
    const compiler = {
        plugin(hook, arg2) {
            if (hook === "compilation") {
                handler = arg2
            }
        }
    }
    let handler
    let message

    plugin.apply(compiler)
    handler()
    t.deepEqual(message, wpCompilation(publisher))
})

test("calls publish() on 'done' with a wpDone message", t => {
    const publisher = "test"
    const options = {
        publisher,
        publish(arg1) {
            message = arg1
        }
    }
    const plugin = new PublishBuildStatusPlugin(options)
    const compiler = {
        plugin(hook, arg2) {
            if (hook === "done") {
                handler = arg2
            }
        }
    }
    const stats = {
        startTime: 2,
        endTime: 5,
        hasErrors: () => true,
        hasWarnings: () => true,
        toString: (...args) => args
    }
    let handler
    let message

    plugin.apply(compiler)
    handler(stats)
    t.deepEqual(message, wpDone(publisher, stats))
})
