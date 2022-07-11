"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnWithTimeout = void 0;
const result_js_1 = require("./result.js");
const cp = require("child_process");
const stream = require("stream");
function spawnWithTimeout(command, args, timeout, stdin = '') {
    const child = cp.spawn(command, args, { stdio: ['pipe', 'pipe', 'pipe'] });
    const stdoutChunks = [];
    const stderrChunks = [];
    const stdinStream = stream.Readable.from(stdin);
    stdinStream.pipe(child.stdin);
    child.stdout.on('data', (chunk) => stdoutChunks.push(chunk.toString()));
    child.stderr.on('data', (chunk) => stderrChunks.push(chunk.toString()));
    return new Promise((resolve, reject) => {
        child.on('error', (err) => {
            clearTimeout(timeoutHandle);
            resolve((0, result_js_1.error)(`Err.spawn ${command}: ${err}`));
        });
        child.on('exit', (code) => {
            clearTimeout(timeoutHandle);
            resolve((0, result_js_1.ok)({
                stdout: stdoutChunks.join(''),
                stderr: stderrChunks.join(''),
                exitCode: code ?? -1,
            }));
        });
        function timeoutHandler() {
            child.kill();
            resolve((0, result_js_1.error)(`Err.timeoutHandler after ${timeout / 1000}s`));
        }
        const timeoutHandle = setTimeout(timeoutHandler, timeout);
    });
}
exports.spawnWithTimeout = spawnWithTimeout;
