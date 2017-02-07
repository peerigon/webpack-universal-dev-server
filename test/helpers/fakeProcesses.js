import EventEmitter from "events";
import { WritableStreamBuffer, ReadableStreamBuffer } from "stream-buffers";

export class WritableProcess extends EventEmitter {
    constructor() {
        super();
        this.stdout = new WritableStreamBuffer();
        this.stderr = new WritableStreamBuffer();
    }
}

export class ReadableProcess extends EventEmitter {
    constructor() {
        super();
        this.stdout = new ReadableStreamBuffer();
        this.stderr = new ReadableStreamBuffer();
    }
}
