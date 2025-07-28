import type { Alias } from "./alias";
import { InvalidAliasNameError } from "./errors/invalid-alias-name-error";
import { MalformattedAliasError } from "./errors/malformatted-alias-error";

export type ParseAliasToken<AliasToken extends string> =
  AliasToken extends `${infer Name}=${infer Target}`
    ? Name extends `${string} ${string}`
      ? InvalidAliasNameError<AliasToken>
      : Alias<Name, Target>
    : MalformattedAliasError<AliasToken>;

export function parseAliasToken<AliasToken extends string>(
  aliasToken: AliasToken,
): ParseAliasToken<AliasToken> {
  const [name, target] = aliasToken.split("=");
  if (!target) return new MalformattedAliasError(aliasToken) as any;
  if (name.includes(" ")) return new InvalidAliasNameError(name) as any;

  return {
    __objectType__: "alias",
    name,
    target,
    meta: {},
  } satisfies Alias as ParseAliasToken<AliasToken>;
}
