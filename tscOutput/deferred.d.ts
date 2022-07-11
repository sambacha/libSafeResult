export declare type DeferredPromise<T> = {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
};
export default function Deferred<T>(): DeferredPromise<T>;
