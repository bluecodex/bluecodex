/*
 * Types
 */
import { ioc } from "../ioc";
import { type ParseAlias, parseAlias } from "./parse-alias";

export type AliasMeta = {
  misspelling?: boolean;
  local?: boolean;
};

export type Alias<
  Name extends string = string,
  Target extends string = string,
> = {
  __objectType__: "alias";
  name: Name;
  target: Target;
  meta: AliasMeta;
};

/*
 * Functions
 */

/**
 * Aliases are defined with a string `name=target`
 */
export function alias<AliasToken extends `${string}=${string}`>(
  aliasToken: AliasToken,
): ParseAlias<AliasToken> {
  const parsedAliasToken = parseAlias(aliasToken);
  if (parsedAliasToken instanceof Error) return parsedAliasToken;

  return ioc.registry.selfRegisterAliasIfEnabled(
    parsedAliasToken,
  ) as ParseAlias<AliasToken>;
}

alias.misspelling = <AliasToken extends `${string}=${string}`>(
  aliasToken: AliasToken,
): ParseAlias<AliasToken> => {
  const parsedAliasToken = parseAlias(aliasToken);
  if (parsedAliasToken instanceof Error) return parsedAliasToken;

  return ioc.registry.selfRegisterAliasIfEnabled({
    ...parsedAliasToken,
    meta: {
      misspelling: true,
    },
  }) as ParseAlias<AliasToken>;
};
