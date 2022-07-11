export interface Result<T> {
    ok: boolean;
    expect(message: string): T;
    map<S>(f: (value: T) => S): Result<S>;
    andThen<S>(f: (value: T) => Result<S>): Result<S>;
    recover(f: (message: string) => T): T;
}
export declare function ok<T>(value: T): Result<T>;
export declare function error<T>(message: string): Result<T>;
export declare function fromPromise<T>(promise: Promise<T>): Promise<Result<T>>;
export declare function fromThunk<T>(thunk: () => T): Result<T>;
