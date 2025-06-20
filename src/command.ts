import {
  type Blueprint,
  type BlueprintFromInput,
  type RecordFromBlueprint,
  blueprint,
} from "./blueprint";
import { ioc } from "./ioc";
import type { ExpandObject } from "./types/object-type-utils";

/*
 * Types
 */

export type CommandFn<B extends Blueprint> = (
  data: {
    argv: string[];
  } & ExpandObject<RecordFromBlueprint<B>>,
) => unknown;

export type CommandMeta<B extends Blueprint> = Partial<{
  [P in B["parts"][number] as P["name"]]: {
    description?: string;
  };
}>;

export type Command<B extends Blueprint = Blueprint> = {
  blueprint: B;
  fn: CommandFn<B>;
  meta?: CommandMeta<B>;
};

/*
 * Functions
 */

export function command<S extends string, B extends BlueprintFromInput<S>>(
  input: S,
  fn: CommandFn<B>,
  meta: CommandMeta<B> = {},
): Command<B> {
  return ioc.commandRegistry.selfRegisterIfEnabled({
    blueprint: blueprint(input),
    fn,
    meta,
  }) as Command<B>;
}
