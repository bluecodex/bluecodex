import {
  type Arg,
  type ArgsToRecord,
  type ExtractArgs,
  isArgStr,
  parseArg,
} from "./arg";
import {
  type ExtractFlags,
  type Flag,
  type FlagsToRecord,
  isFlagStr,
  parseFlag,
} from "./flag";
import type { AfterChar, BeforeChar } from "./types/string-type-utils";

export type Blueprint<S extends string = string> = {
  name: BeforeChar<" ", S>;
  args: AfterChar<" ", S> extends never ? [] : ExtractArgs<AfterChar<" ", S>>;
  flags: AfterChar<" ", S> extends never ? [] : ExtractFlags<AfterChar<" ", S>>;
};

export type RecordFromBlueprint<B extends Blueprint> = ArgsToRecord<B["args"]> &
  FlagsToRecord<B["flags"]>;

export function blueprint<S extends string>(str: S): Blueprint<S> {
  const [name, ...parts] = str.split(" ");

  const args: Arg[] = parts.filter(isArgStr).map(parseArg);
  const flags: Flag[] = parts.filter(isFlagStr).map(parseFlag);

  return { name, args, flags } as Blueprint<S>;
}
