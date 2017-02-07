module.exports = function (wallaby) {
    return {
        env: {
            type: "node"
        },
        files: [
            "lib/**/**.js",
            "test/**/**.js.snap"
        ],
        tests: [
            "test/**/**.test.js"
        ],
        compilers: {
            "**/*.js": wallaby.compilers.babel()
        },
        testFramework: "ava"
    };
};

