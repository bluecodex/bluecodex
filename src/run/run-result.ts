export type RunResult = {
  __objectType__: "run-result";
  exitCode: number | null;
  failed: boolean;
};

export type RunResultWithOutput = {
  __objectType__: "run-result-with-output";
  exitCode: number | null;
  failed: boolean;

  output: string;
  stdout: string;
  stderr: string;
};
