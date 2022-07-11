import * as cp from 'child_process';
import * as stream from 'stream';

function Deferred() {
  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
}

class OK {
  constructor(value) {
    this.value = value;
  }
  ok = true;
  expect(message) {
    return this.value;
  }
  andThen(f) {
    return f(this.value);
  }
  map(f) {
    return new OK(f(this.value));
  }
  recover(f) {
    return this.value;
  }
  toString() {
    return `OK(${this.value})`;
  }
}
class Error {
  constructor(message) {
    this.message = message;
  }
  ok = false;
  expect(message) {
    console.error(`${message}: ${this.message}`);
    throw new Error(message);
  }
  andThen(f) {
    return new Error(this.message);
  }
  map(f) {
    return new Error(this.message);
  }
  recover(f) {
    return f(this.message);
  }
}
function ok(value) {
  return new OK(value);
}
function error(message) {
  return new Error(message);
}
function fromThunk(thunk) {
  try {
    return ok(thunk());
  } catch (exn) {
    return error(exn);
  }
}

function spawnWithTimeout(command, args, timeout, stdin = "") {
  const child = cp.spawn(command, args, { stdio: ["pipe", "pipe", "pipe"] });
  const stdoutChunks = [];
  const stderrChunks = [];
  const stdinStream = stream.Readable.from(stdin);
  stdinStream.pipe(child.stdin);
  child.stdout.on("data", (chunk) => stdoutChunks.push(chunk.toString()));
  child.stderr.on("data", (chunk) => stderrChunks.push(chunk.toString()));
  return new Promise((resolve, reject) => {
    child.on("error", (err) => {
      clearTimeout(timeoutHandle);
      resolve(error(`Error spawning ${command}: ${err}`));
    });
    child.on("exit", (code) => {
      clearTimeout(timeoutHandle);
      resolve(ok({
        stdout: stdoutChunks.join(""),
        stderr: stderrChunks.join(""),
        exitCode: code ?? -1
      }));
    });
    function timeoutHandler() {
      child.kill();
      resolve(error(`Timed out after ${timeout / 1e3}s`));
    }
    const timeoutHandle = setTimeout(timeoutHandler, timeout);
  });
}

export { Deferred, error, fromThunk, ok, spawnWithTimeout };
