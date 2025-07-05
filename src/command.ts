import {
  type Blueprint,
  type RecordFromBlueprint,
} from "./blueprint/blueprint";
import {
  type ParseBlueprint,
  parseBlueprint,
} from "./blueprint/parse-blueprint";
import { ioc } from "./ioc";
import type { ExpandObject } from "./types/object-type-utils";

/*
 * Types
 */

export type CommandFn<B extends Blueprint> = (
  data: ExpandObject<{ argv: string[] } & RecordFromBlueprint<B>>,
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

export function command<
  BlueprintToken extends string,
  B extends ParseBlueprint<BlueprintToken>,
>(
  blueprintToken: BlueprintToken,
  fn: CommandFn<B>,
  meta: CommandMeta<B> = {},
): Command<B> {
  return ioc.commandRegistry.selfRegisterIfEnabled({
    blueprint: parseBlueprint(blueprintToken),
    fn,
    meta,
  }) as Command<B>;
}
