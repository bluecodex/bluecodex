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

export type Command<B extends Blueprint = Blueprint> = {
  blueprint: B;
  fn: CommandFn<B>;
};

/*
 * Functions
 */

export function command<S extends string>(
  blueprintStr: S,
  fn: CommandFn<Blueprint<S>>,
): Command<Blueprint<S>> {
  return ioc.commandRegistry.selfRegisterIfEnabled({
    blueprint: blueprint(blueprintStr),
    fn,
  });
}
