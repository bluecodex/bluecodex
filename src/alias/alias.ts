/*
 * Types
 */
import { ioc } from "../ioc";
import { MalformattedAliasError } from "./errors/malformatted-alias-error";
import { type ParseAliasToken, parseAliasToken } from "./parse-alias-token";

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
): ParseAliasToken<AliasToken> {
  const parsedAliasToken = parseAliasToken(aliasToken);
  if (parsedAliasToken instanceof Error) return parsedAliasToken;

  return ioc.registry.selfRegisterAliasIfEnabled(
    parsedAliasToken,
  ) as ParseAliasToken<AliasToken>;
}

alias.misspelling = <AliasToken extends `${string}=${string}`>(
  aliasToken: AliasToken,
): ParseAliasToken<AliasToken> => {
  const parsedAliasToken = parseAliasToken(aliasToken);
  if (parsedAliasToken instanceof Error) return parsedAliasToken;

  return ioc.registry.selfRegisterAliasIfEnabled({
    ...parsedAliasToken,
    meta: {
      misspelling: true,
    },
  });
};
