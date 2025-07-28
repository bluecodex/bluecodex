import type { CommandAlias } from "./command-alias";

export function parseAliasToken<AliasToken extends `${string}=${string}`>(
  aliasToken: AliasToken,
): CommandAlias {
  const [alias, name] = aliasToken.split("=");

  return {
    __objectType__: "command-alias",
    alias,
    target: name,
  };
}
