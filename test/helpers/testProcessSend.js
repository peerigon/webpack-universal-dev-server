// This helper funtion is necessary because messing with process.send() can break ava's test results
export default function testProcessSend(test, processSendMock) {
    const send = process.send;
    let err;
    let args;

    process.send = arguments.length < 2 ? function () {
        args = arguments;
    } : processSendMock;

    try {
        test();
    } catch (e) {
        err = e;
    }

    process.send = send;

    if (err) {
        throw err;
    }

    return args;
}
