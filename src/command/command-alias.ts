export type CommandAlias<
  Alias extends string = string,
  Target extends string = string,
> = {
  __objectType__: "command-alias";
  alias: Alias;
  target: Target;
  local?: boolean;
};
