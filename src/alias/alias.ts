/*
 * Types
 */
import { ioc } from "../ioc";
import { MalformattedAliasError } from "./errors/malformatted-alias-error";
import { type ParseAliasToken, parseAliasToken } from "./parse-alias-token";

export type AliasMeta = {
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

export function alias<AliasToken extends string>(
  aliasToken: AliasToken,
): ParseAliasToken<AliasToken> {
  const parsedAliasToken = parseAliasToken(aliasToken);

  if (parsedAliasToken instanceof MalformattedAliasError) {
    return parsedAliasToken;
  }

  return ioc.registry.selfRegisterAliasIfEnabled(
    parsedAliasToken,
  ) as ParseAliasToken<AliasToken>;
}
