export type SpawnStdOption =
  | "pipe-and-inherit"
  /**
   * When std === 'tty' we don't capture the output as it
   * gets piped directly to output stream.
   */
  | "tty";
