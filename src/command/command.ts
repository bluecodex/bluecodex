import { type Blueprint } from "../blueprint/blueprint";
import {
  type ParseBlueprint,
  parseBlueprint,
} from "../blueprint/parse-blueprint";
import type { DataTypeSchema } from "../data-type/data-type-schema";
import type { DataTypeToken } from "../data-type/data-type-token";
import { ioc } from "../ioc";
import type { ParsedArgvData } from "../parse-argv/parsed-argv-data";
import type { RunResult, RunResultWithOutput } from "../run/run-result";
import type { ExpandObject } from "../types/object-type-utils";

/*
 * Types
 */

export type CommandFn<B extends Blueprint, CS extends CommandSchema<B>> = (
  data: ExpandObject<{ argv: string[] } & ParsedArgvData<B, CS>>,
) =>
  | void
  | number
  | boolean
  | null
  | RunResult
  | RunResultWithOutput
  | Promise<void | number | boolean | null | RunResult | RunResultWithOutput>;

export type CommandMeta = {
  todo?: boolean;
  local?: boolean;
};

export type Command<
  B extends Blueprint = Blueprint,
  CS extends CommandSchema<B> = CommandSchema<B>,
> = {
  __objectType__: "command";
  blueprint: B;
  schema: CS;
  fn: CommandFn<B, CS>;
  meta: CommandMeta;
};

export type CommandSchema<B extends Blueprint = Blueprint> = {
  description?: string;
} & Partial<{
  [F in B["fields"][number] as F["name"]]: F["type"] extends DataTypeToken
    ? DataTypeSchema<F["type"]>
    : {};
}>;

/*
 * Functions
 */

export function command<
  BlueprintToken extends string,
  B extends ParseBlueprint<BlueprintToken>,
  CS extends CommandSchema<B>,
>(
  blueprintToken: BlueprintToken,
  schema: CS,
  fn: CommandFn<B, CS>,
): Command<B, CS> {
  return ioc.registry.selfRegisterCommandIfEnabled({
    __objectType__: "command",
    blueprint: parseBlueprint(blueprintToken),
    schema,
    fn,
    meta: {},
  }) as Command<B, CS>;
}

command.todo = <
  BlueprintToken extends string,
  B extends ParseBlueprint<BlueprintToken>,
  CS extends CommandSchema<B>,
>(
  blueprintToken: BlueprintToken,
  schema: CS,
  fn: CommandFn<B, CS>,
): Command<B, CS> => {
  return ioc.registry.selfRegisterCommandIfEnabled({
    __objectType__: "command",
    blueprint: parseBlueprint(blueprintToken),
    schema,
    fn,
    meta: { todo: true },
  }) as Command<B, CS>;
};
