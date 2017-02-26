module.exports = function () {
    return {
        devServer: {
            port: 1337,
            setup(app) {
                this.setupCalled = true;
                return app;
            }
        }
    };
};
