interface Result<T> {
    ok: boolean;
    expect(message: string): T;
    map<S>(f: (value: T) => S): Result<S>;
    andThen<S>(f: (value: T) => Result<S>): Result<S>;
    recover(f: (message: string) => T): T;
}
declare function ok<T>(value: T): Result<T>;
declare function error<T>(message: string): Result<T>;
declare function fromPromise<T>(promise: Promise<T>): Promise<Result<T>>;
declare function fromThunk<T>(thunk: () => T): Result<T>;

declare function spawnWithTimeout(command: string, args: string[], timeout: number, stdin?: string): Promise<Result<{
    stdout: string;
    stderr: string;
    exitCode: number;
}>>;

declare const process_spawnWithTimeout: typeof spawnWithTimeout;
declare namespace process {
  export {
    process_spawnWithTimeout as spawnWithTimeout,
  };
}

declare function sleepInSeconds(seconds: number): Promise<void>;

export { process as Process, Result, error, fromPromise, fromThunk, ok, sleepInSeconds };
