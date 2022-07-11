export interface Result<T> {
  ok: boolean;
  expect(message: string): T;
  map<S>(f: (value: T) => S): Result<S>;
  andThen<S>(f: (value: T) => Result<S>): Result<S>;
  recover(f: (message: string) => T): T;
}

class OK<T> implements Result<T> {
  public readonly ok: boolean = true;
  constructor(public readonly value: T) {}
  public expect(message: string): T {
    return this.value;
  }

  public andThen<S>(f: (value: T) => Result<S>): Result<S> {
    return f(this.value);
  }

  public map<S>(f: (value: T) => S): Result<S> {
    return new OK(f(this.value));
  }

  public recover(f: (message: string) => T): T {
    return this.value;
  }

  public toString(): string {
    return `OK(${this.value})`;
  }
}

class Error<T> implements Result<T> {
  public readonly ok: boolean = false;
  constructor(public readonly message: string) {}
  public expect(message: string): T {
    console.error(`${message}: ${this.message}`);
    throw new Error(message);
  }
  public andThen<S>(f: (value: T) => Result<S>): Result<S> {
    return new Error(this.message);
  }

  public map<S>(f: (value: T) => S): Result<S> {
    return new Error(this.message);
  }

  public recover(f: (message: string) => T): T {
    return f(this.message);
  }
}

export function ok<T>(value: T): Result<T> {
  return new OK(value);
}

export function error<T>(message: string): Result<T> {
  return new Error(message);
}

export async function fromPromise<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    return ok(await promise);
  } catch (exn) {
    return error(exn as any);
  }
}

export function fromThunk<T>(thunk: () => T): Result<T> {
  try {
    return ok(thunk());
  } catch (exn) {
    return error(exn as any);
  }
}
