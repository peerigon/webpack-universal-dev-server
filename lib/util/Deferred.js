// @flow

class Deferred {
    promise: Promise<any>;
    resolve: Function;
    reject: Function;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

export default Deferred;
