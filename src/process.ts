import { ok, error } from './result.js';
import type { Result } from './result.js';
import * as cp from 'child_process';
import * as stream from 'stream';


export function spawnWithTimeout(
  command: string,
  args: string[],
  timeout: number,
  stdin: string = '',
): Promise<Result<{ stdout: string; stderr: string; exitCode: number }>> {
  const child = cp.spawn(command, args, { stdio: ['pipe', 'pipe', 'pipe'] });
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];

  const stdinStream = stream.Readable.from(stdin);
  stdinStream.pipe(child.stdin);

  child.stdout.on('data', (chunk) => stdoutChunks.push(chunk.toString()));
  child.stderr.on('data', (chunk) => stderrChunks.push(chunk.toString()));
  return new Promise((resolve, reject) => {
    child.on('error', (err) => {
      clearTimeout(timeoutHandle);
      resolve(error(`Err.spawn ${command}: ${err}`));
    });
    child.on('exit', (code) => {
      clearTimeout(timeoutHandle);
      resolve(
        ok({
          stdout: stdoutChunks.join(''),
          stderr: stderrChunks.join(''),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          exitCode: code ?? -1,
        }),
      );
    });
    function timeoutHandler() {
      child.kill();
      resolve(error(`Err.timeoutHandler after ${timeout / 1000}s`));
    }
    const timeoutHandle = setTimeout(timeoutHandler, timeout);
  });
}
