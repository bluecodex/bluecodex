export type RunResult = {
  output: string;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  failed: boolean;
};
