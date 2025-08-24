import { assertBlueprintIsValid } from "../blueprint/assert-blueprint-is-valid";
import { type Blueprint, type ValidBlueprint } from "../blueprint/blueprint";
import {
  type ParseBlueprint,
  parseBlueprint,
} from "../blueprint/parse-blueprint";
import type { DataType } from "../data-type/data-type";
import type { DataTypeSchema } from "../data-type/data-type-schema";
import type { DataTypeToken } from "../data-type/data-type-token";
import { ioc } from "../ioc";
import type { ParsedArgvData } from "../parse-argv/parsed-argv-data";
import type { RunResult, RunResultWithOutput } from "../run/run-result";
import type { ExpandObject } from "../types/object-type-utils";

/*
 * Types
 */

export type CommandFn<
  B extends Blueprint = Blueprint,
  S extends CommandSchema<B> = CommandSchema<B>,
> = (
  data: ExpandObject<{ argv: string[] } & ParsedArgvData<B, S>>,
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
  embedded?: boolean;
};

export type Command = {
  __objectType__: "command";
  blueprint: ValidBlueprint;
  schema: CommandSchema;
  fn: CommandFn;
  meta: CommandMeta;
};

export type CommandSchema<B extends Blueprint = Blueprint> = {
  description?: string;
} & Partial<{
  [F in B["fields"][number] as F["name"]]: DataTypeSchema<
    F["type"] extends DataTypeToken ? DataType<F["type"]> : DataTypeToken
  >;
}>;

/*
 * Functions
 */

export function command<
  BlueprintToken extends string,
  B extends ParseBlueprint<BlueprintToken>,
  S extends CommandSchema<B>,
>(blueprintToken: BlueprintToken, schema: S, fn: CommandFn<B, S>): Command {
  const blueprint = parseBlueprint(blueprintToken);
  assertBlueprintIsValid(blueprint);

  return ioc.registry.selfRegisterCommandIfEnabled({
    __objectType__: "command",
    blueprint,
    schema,
    fn,
    meta: {},
  });
}

command.todo = <
  BlueprintToken extends string,
  B extends ParseBlueprint<BlueprintToken>,
  S extends CommandSchema<B>,
>(
  blueprintToken: BlueprintToken,
  schema: S,
  fn: CommandFn<B, S>,
): Command => {
  const blueprint = parseBlueprint(blueprintToken);
  assertBlueprintIsValid(blueprint);

  return ioc.registry.selfRegisterCommandIfEnabled({
    __objectType__: "command",
    blueprint,
    schema,
    fn,
    meta: { todo: true },
  }) as Command;
};

export function embeddedCommand<
  BlueprintToken extends string,
  B extends ParseBlueprint<BlueprintToken>,
  S extends CommandSchema<B>,
>(blueprintToken: BlueprintToken, schema: S, fn: CommandFn<B, S>): Command {
  const blueprint = parseBlueprint(blueprintToken);
  assertBlueprintIsValid(blueprint);

  return ioc.registry.selfRegisterCommandIfEnabled({
    __objectType__: "command",
    blueprint,
    schema,
    fn,
    meta: { embedded: true },
  }) as Command;
}
