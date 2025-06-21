import {
  type Blueprint,
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
  [key in
    | Blueprint["args"][number]["name"]
    | Blueprint["flags"][number]["name"]]: {
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

export function command<S extends string>(
  input: S,
  fn: CommandFn<Blueprint<S>>,
  meta: CommandMeta<Blueprint<S>> = {},
): Command<Blueprint<S>> {
  return ioc.commandRegistry.selfRegisterIfEnabled({
    blueprint: blueprint(input),
    fn,
    meta,
  });
}
