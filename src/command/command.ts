import {
  type Blueprint,
  type RecordFromBlueprint,
} from "../blueprint/blueprint";
import {
  type ParseBlueprint,
  parseBlueprint,
} from "../blueprint/parse-blueprint";
import { ioc } from "../ioc";
import type { ExpandObject } from "../types/object-type-utils";

/*
 * Types
 */

export type CommandFn<B extends Blueprint> = (
  data: ExpandObject<{ argv: string[] } & RecordFromBlueprint<B>>,
) => void | Promise<void> | number | Promise<number> | null | Promise<null>;

export type CommandMeta<B extends Blueprint> = {
  todo?: boolean;
  local?: boolean;
} & Partial<{
  [P in B["parts"][number] as P["name"]]: {
    description?: string;
  };
}>;

export type Command<B extends Blueprint = Blueprint> = {
  __objectType__: "command";
  blueprint: B;
  fn: CommandFn<B>;
  meta: CommandMeta<B>;
};

/*
 * Functions
 */

export function command<
  BlueprintToken extends string,
  B extends ParseBlueprint<BlueprintToken>,
>(blueprintToken: BlueprintToken, fn: CommandFn<B>): Command<B> {
  return ioc.registry.selfRegisterCommandIfEnabled({
    __objectType__: "command",
    blueprint: parseBlueprint(blueprintToken),
    fn,
    meta: {}, // TODO
  }) as Command<B>;
}

command.todo = <
  BlueprintToken extends string,
  B extends ParseBlueprint<BlueprintToken>,
>(
  blueprintToken: BlueprintToken,
  fn: CommandFn<B>,
) => {
  return ioc.registry.selfRegisterCommandIfEnabled({
    __objectType__: "command",
    blueprint: parseBlueprint(blueprintToken),
    fn,
    meta: { todo: true }, // TODO
  }) as Command<B>;
};
