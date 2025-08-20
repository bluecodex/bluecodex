export type RunResult = {
  __objectType__: "run-result";

  exitCode: number | null;
  failed: boolean;
};

export type RunResultWithOutput = {
  __objectType__: "run-result-with-output";

  all: string;
  stdout: string;
  stderr: string;

  exitCode: number | null;
  failed: boolean;
};
