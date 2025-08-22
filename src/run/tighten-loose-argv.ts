import os from "node:os";
import path from "node:path";

import type { LooseArgv } from "./loose-argv";

/**
 * Converts LooseArgv into string[], which is the standard argv format
 */
export function tightenLooseArgv(looseArgv: LooseArgv): string[] {
  const argv = (
    Array.isArray(looseArgv)
      ? looseArgv.flat().filter(Boolean).join(" ")
      : looseArgv
  ).split(" ");

  return argv.map((part) =>
    // auto-expand ~/ so we don't need to set shell:true when running the command
    part.startsWith("~/") ? path.join(os.homedir(), part.slice(2)) : part,
  );
}
