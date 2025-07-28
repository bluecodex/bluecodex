import type { Alias } from "./alias";

export function parseAliasToken<AliasToken extends `${string}=${string}`>(
  aliasToken: AliasToken,
): Alias {
  const [alias, name] = aliasToken.split("=");

  return {
    __objectType__: "alias",
    name: alias,
    target: name,
  };
}
