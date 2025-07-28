/*
 * Types
 */
import { ioc } from "../ioc";
import { parseAliasToken } from "./parse-alias-token";

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

export function alias<AliasToken extends `${string}=${string}`>(
  aliasToken: AliasToken,
) {
  return ioc.registry.selfRegisterAliasIfEnabled(parseAliasToken(aliasToken));
}
