import type { Flag, ValidFlag } from "./flag";

export function assertFlagIsValid(flag: Flag): asserts flag is ValidFlag {
  if (flag.type instanceof Error) throw flag.type;
  if (flag.short instanceof Error) throw flag.short;
  if (flag.fallback instanceof Error) throw flag.fallback;
}
