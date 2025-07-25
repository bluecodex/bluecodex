import type { RawCmd } from "./raw-cmd";

export function rawCmdToStringSplit(rawCmd: RawCmd): string[] {
  // each part may be a string with argv separated by space
  if (Array.isArray(rawCmd)) {
    return rawCmd.flat().filter(Boolean).join(" ").split(" ");
  }

  return rawCmd.split(" ");
}
