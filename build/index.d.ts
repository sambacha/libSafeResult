export interface IResultOk<T> {
  res: T;
  err?: undefined;
}
export interface IResultErr {
  res?: undefined;
  err: string;
}
export declare type TResult<T> = IResultOk<T> | IResultErr;
export declare class Result<T> {
  static from<T>(value: TResult<T>): Result<T>;
  private readonly val;
  constructor(value: TResult<T>);
  and<U>(func: (arg: T) => Result<U>): Result<U>;
  unwrap(): T;
  expect(msg: string): T;
  ok(): boolean;
  err(): string | undefined;
  toVal(): TResult<T>;
  private isOk;
}
