import {
  type Blueprint,
  type BlueprintDefinition,
  type RecordFromBlueprint,
} from "../blueprint/blueprint";
import {
  type ParseBlueprint,
  parseBlueprint,
} from "../blueprint/parse-blueprint";
import { ioc } from "../ioc";
import type { RunResult, RunResultWithOutput } from "../run/run-result";
import type { ExpandObject } from "../types/object-type-utils";

/*
 * Types
 */

export type CommandFn<B extends Blueprint> = (
  data: ExpandObject<{ argv: string[] } & RecordFromBlueprint<B>>,
) =>
  | void
  | number
  | boolean
  | null
  | RunResult
  | RunResultWithOutput
  | Promise<void | number | boolean | null | RunResult | RunResultWithOutput>;

export type CommandMeta<B extends Blueprint> = {
  description?: string;
  todo?: boolean;
  local?: boolean;
};

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
  Definition extends BlueprintDefinition<BlueprintToken>,
  B extends ParseBlueprint<Definition>,
>(
  definition: Definition,
  fn: CommandFn<B>,
  meta?: Omit<CommandMeta<B>, "todo" | "local">,
): Command<B> {
  return ioc.registry.selfRegisterCommandIfEnabled({
    __objectType__: "command",
    blueprint: parseBlueprint(definition) as any,
    fn,
    meta: meta ?? {},
  }) as Command<B>;
}

command.todo = <
  BlueprintToken extends string,
  Definition extends BlueprintDefinition<BlueprintToken>,
  B extends ParseBlueprint<Definition>,
>(
  definition: Definition,
  fn: CommandFn<B>,
  meta?: Omit<CommandMeta<B>, "todo" | "local">,
) => {
  return ioc.registry.selfRegisterCommandIfEnabled({
    __objectType__: "command",
    blueprint: parseBlueprint(definition),
    fn,
    meta: { ...meta, todo: true },
  }) as Command<B>;
};
