"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
class Result {
    static from(value) {
        return new Result(value);
    }
    val;
    constructor(value) {
        this.val = value;
    }
    and(func) {
        if (this.isOk(this.val)) {
            const nextAssertable = func(this.val.res);
            const nextVal = nextAssertable.toVal();
            if (nextAssertable.isOk(nextVal)) {
                return Result.from({ res: nextVal.res });
            }
            else {
                return Result.from({
                    err: nextVal.err,
                });
            }
        }
        else {
            return Result.from({ err: this.val.err });
        }
    }
    unwrap() {
        if (this.isOk(this.val)) {
            return this.val.res;
        }
        throw Error(this.val.err);
    }
    expect(msg) {
        if (this.isOk(this.val)) {
            return this.val.res;
        }
        throw Error(msg);
    }
    ok() {
        return !this.val.err;
    }
    err() {
        return this.val.err;
    }
    toVal() {
        return this.val;
    }
    isOk(val) {
        return !val.err;
    }
}
exports.Result = Result;
