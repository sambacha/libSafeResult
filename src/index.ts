/**
 * Interface representing a successful result.
 * @template T - The type of the successful result.
 */
export interface IResultOk<T> {
  res: T;
  err?: undefined;
}

/**
 * Interface representing a failed result.
 */
export interface IResultErr {
  res?: undefined;
  err: string;
}

/**
 * Type alias for a result, which can either be successful or failed.
 * @template T - The type of the successful result.
 */
export type TResult<T> = IResultOk<T> | IResultErr;

/**
 * Class for encapsulating a result, which can either be a success or failure.
 * Provides utility methods for handling result values in a type-safe manner.
 * @template T - The type of the successful result.
 */
export class Result<T> {
  private readonly val: TResult<T>;

  /**
   * Creates a successful result.
   * @param value - The value of the successful result.
   * @returns A new `Result` instance representing success.
   */
  public static ok<T>(value: T): Result<T> {
    return new Result({ res: value });
  }

  /**
   * Creates a failed result.
   * @param error - The error message of the failed result.
   * @returns A new `Result` instance representing failure.
   */
  public static err<T>(error: string): Result<T> {
    return new Result({ err: error });
  }

  /**
   * Converts an existing result type into a `Result` instance.
   * @param value - The existing result to convert.
   * @returns A new `Result` instance.
   */
  public static from<T>(value: TResult<T>): Result<T> {
    return new Result(value);
  }

  /**
   * Constructs a `Result` instance.
   * @param value - The underlying result value.
   */
  constructor(value: TResult<T>) {
    this.val = value;
  }

  /**
   * Maps the successful result value to a new value using the provided function.
   * @template U - The type of the new result value.
   * @param fn - A function that transforms the successful result value.
   * @returns A new `Result` instance with the transformed value or the original error.
   */
  public map<U>(fn: (value: T) => U): Result<U> {
    return this.isOk(this.val)
      ? Result.ok(fn(this.val.res))
      : Result.err(this.val.err);
  }

  /**
   * Chains the result to another result-producing function.
   * @template U - The type of the new result value.
   * @param fn - A function that takes the successful result value and returns a new `Result`.
   * @returns A new `Result` instance.
   */
  public and<U>(fn: (arg: T) => Result<U>): Result<U> {
    return this.isOk(this.val)
      ? fn(this.val.res)
      : Result.err(this.val.err);
  }

  /**
   * Provides an alternative result if the current result is a failure.
   * @template U - The type of the alternative result value.
   * @param fn - A function that takes the error message and returns an alternative `Result`.
   * @returns The current `Result` if successful, otherwise the alternative `Result`.
   */
  public orElse<U>(fn: (error: string) => Result<U>): Result<T | U> {
    return this.isOk(this.val)
      ? this
      : fn(this.val.err);
  }

  /**
   * Unwraps the successful result value or throws an error if the result is a failure.
   * @throws An error if the result is a failure.
   * @returns The successful result value.
   */
  public unwrap(): T {
    if (this.isOk(this.val)) {
      return this.val.res;
    }
    throw new Error(this.val.err);
  }

  /**
   * Unwraps the successful result value or throws an error with the provided message if the result is a failure.
   * @param msg - The custom error message to throw if the result is a failure.
   * @throws An error with the provided message if the result is a failure.
   * @returns The successful result value.
   */
  public expect(msg: string): T {
    if (this.isOk(this.val)) {
      return this.val.res;
    }
    throw new Error(msg);
  }

  /**
   * Checks if the result is a success.
   * @returns `true` if the result is a success, otherwise `false`.
   */
  public isSuccess(): this is Result<T> & { val: IResultOk<T> } {
    return this.isOk(this.val);
  }

  /**
   * Checks if the result is a failure.
   * @returns `true` if the result is a failure, otherwise `false`.
   */
  public isFailure(): this is Result<T> & { val: IResultErr } {
    return !this.isOk(this.val);
  }

  /**
   * Checks if the result contains no error.
   * @returns `true` if the result is successful, otherwise `false`.
   */
  public ok(): boolean {
    return !this.val.err;
  }

  /**
   * Gets the error message of the result if it is a failure.
   * @returns The error message if the result is a failure, otherwise `undefined`.
   */
  public err(): string | undefined {
    return this.val.err;
  }

  /**
   * Retrieves the underlying value of the result.
   * @returns The underlying result value.
   */
  public toVal(): TResult<T> {
    return this.val;
  }

  /**
   * Type guard for checking if the result is a success.
   * @param val - The result value to check.
   * @returns `true` if the result is a success, otherwise `false`.
   */
  private isOk(val: TResult<T>): val is IResultOk<T> {
    return !val.err;
  }
}
