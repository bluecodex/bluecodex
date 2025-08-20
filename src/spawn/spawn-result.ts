export type SpawnResult = {
  __objectType__: "spawn-result";

  rawAll: string | null;
  rawStdout: string | null;
  rawStderr: string | null;

  exitCode: number | null;
  failed: boolean;
};
