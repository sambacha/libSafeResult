"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromThunk = exports.fromPromise = exports.error = exports.ok = void 0;
class OK {
    value;
    ok = true;
    constructor(value) {
        this.value = value;
    }
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
    message;
    ok = false;
    constructor(message) {
        this.message = message;
    }
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
exports.ok = ok;
function error(message) {
    return new Error(message);
}
exports.error = error;
async function fromPromise(promise) {
    try {
        return ok(await promise);
    }
    catch (exn) {
        return error(exn);
    }
}
exports.fromPromise = fromPromise;
function fromThunk(thunk) {
    try {
        return ok(thunk());
    }
    catch (exn) {
        return error(exn);
    }
}
exports.fromThunk = fromThunk;
