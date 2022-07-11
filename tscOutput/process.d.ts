import type { Result } from './result.js';
export declare function spawnWithTimeout(command: string, args: string[], timeout: number, stdin?: string): Promise<Result<{
    stdout: string;
    stderr: string;
    exitCode: number;
}>>;
