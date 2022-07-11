export * from './result';
export * as Process from './process';

export async function sleepInSeconds(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}
