import {
  type Arg,
  type ArgsToRecord,
  type ExtractArgs,
  isArgInput,
  parseArg,
} from "./arg";
import {
  type ExtractFlags,
  type Flag,
  type FlagsToRecord,
  isFlagInput,
  parseFlag,
} from "./flag";
import type { EmptyArray } from "./types/array-type-utils";
import type { AfterChar, BeforeChar } from "./types/string-type-utils";

export type Blueprint<S extends string = any> = {
  name: BeforeChar<" ", S>;
  args: AfterChar<" ", S> extends never
    ? EmptyArray<Arg>
    : ExtractArgs<AfterChar<" ", S>>;
  flags: AfterChar<" ", S> extends never
    ? EmptyArray<Flag>
    : ExtractFlags<AfterChar<" ", S>>;
};

export type RecordFromBlueprint<B extends Blueprint> = ArgsToRecord<B["args"]> &
  FlagsToRecord<B["flags"]>;

export function blueprint<S extends string>(input: S): Blueprint<S> {
  const [name, ...parts] = input.split(" ");

  const args: Arg[] = parts.filter(isArgInput).map(parseArg);
  const flags: Flag[] = parts.filter(isFlagInput).map(parseFlag);

  return { name, args, flags } as Blueprint<S>;
}
