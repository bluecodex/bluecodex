import type { Arg, ValidArg } from "./arg";

export function assertArgIsValid(arg: Arg): asserts arg is ValidArg {
  if (arg.type instanceof Error) throw arg.type;
  if (arg.fallback instanceof Error) throw arg.fallback;
}
