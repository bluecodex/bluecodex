import type { LooseArgv } from "./loose-argv";

/**
 * Converts LooseArgv into string[], which is the standard argv format
 */
export function tightenLooseArgv(looseArgv: LooseArgv): string[] {
  // each part may be a string with argv separated by space
  if (Array.isArray(looseArgv)) {
    return looseArgv.flat().filter(Boolean).join(" ").split(" ");
  }

  return looseArgv.split(" ");
}
