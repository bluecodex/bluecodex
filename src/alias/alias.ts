/*
 * Types
 */
import { ioc } from "../ioc";
import { parseAliasToken } from "./parse-alias-token";

export type Alias<
  Name extends string = string,
  Target extends string = string,
> = {
  __objectType__: "alias";
  name: Name;
  target: Target;
  local?: boolean;
};

/*
 * Functions
 */

export function alias<AliasToken extends `${string}=${string}`>(
  aliasToken: AliasToken,
) {
  return ioc.registry.selfRegisterAliasIfEnabled(parseAliasToken(aliasToken));
}
