module.exports = function (wallaby) {
    return {
        env: {
            type: "node"
        },
        files: [
            "lib/**/**.js"
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

