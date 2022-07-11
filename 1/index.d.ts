declare type DeferredPromise<T> = {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
};
declare function Deferred<T>(): DeferredPromise<T>;

interface Result<T> {
    ok: boolean;
    expect(message: string): T;
    map<S>(f: (value: T) => S): Result<S>;
    andThen<S>(f: (value: T) => Result<S>): Result<S>;
    recover(f: (message: string) => T): T;
}
declare function ok<T>(value: T): Result<T>;
declare function error<T>(message: string): Result<T>;
declare function fromThunk<T>(thunk: () => T): Result<T>;

declare function spawnWithTimeout(command: string, args: string[], timeout: number, stdin?: string): Promise<Result<{
    stdout: string;
    stderr: string;
    exitCode: number;
}>>;

export { Deferred, DeferredPromise, Result, error, fromThunk, ok, spawnWithTimeout };
