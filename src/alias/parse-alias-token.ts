import type { Alias } from "./alias";
import { MalformattedAliasError } from "./errors/malformatted-alias-error";

export type ParseAliasToken<AliasToken extends string> =
  AliasToken extends `${infer Name}=${infer Target}`
    ? Alias<Name, Target>
    : MalformattedAliasError<AliasToken>;

export function parseAliasToken<AliasToken extends string>(
  aliasToken: AliasToken,
): ParseAliasToken<AliasToken> {
  const [alias, name] = aliasToken.split("=");
  if (!name) return new MalformattedAliasError(aliasToken) as any;

  return {
    __objectType__: "alias",
    name: alias,
    target: name,
    meta: {},
  } satisfies Alias as ParseAliasToken<AliasToken>;
}
