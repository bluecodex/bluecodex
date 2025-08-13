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

export type CommandFn<B extends Blueprint> = (
  data: ExpandObject<{ argv: string[] } & ParsedArgvData<B>>,
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

export type Command<B extends Blueprint = Blueprint> = {
  __objectType__: "command";
  blueprint: B;
  schema: CommandSchema<B>;
  fn: CommandFn<B>;
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
>(
  blueprintToken: BlueprintToken,
  schema: CommandSchema<B>,
  fn: CommandFn<B>,
): Command<B> {
  return ioc.registry.selfRegisterCommandIfEnabled({
    __objectType__: "command",
    blueprint: parseBlueprint(blueprintToken),
    schema,
    fn,
    meta: {},
  }) as Command<B>;
}

command.todo = <
  BlueprintToken extends string,
  B extends ParseBlueprint<BlueprintToken>,
>(
  blueprintToken: BlueprintToken,
  schema: CommandSchema<B>,
  fn: CommandFn<B>,
): Command<B> => {
  return ioc.registry.selfRegisterCommandIfEnabled({
    __objectType__: "command",
    blueprint: parseBlueprint(blueprintToken),
    schema,
    fn,
    meta: { todo: true },
  }) as Command<B>;
};
