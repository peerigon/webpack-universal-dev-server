import test from "ava"
import { spawnBin, fixturePath } from "../helpers/bin"

test.skip("should start without errors when executed in a directory with the default structure", async () => {
    const cp = spawnBin({
        cwd: fixturePath("defaultApp")
    })

    await cp.stdoutPattern("bla")
})
