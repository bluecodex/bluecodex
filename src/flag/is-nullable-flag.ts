import type { Flag } from "./flag";

export type IsNullableFlag<F extends Flag> = F["type"] extends "boolean"
  ? false
  : F["required"] extends true
    ? false
    : F["fallback"] extends null
      ? true
      : false;
