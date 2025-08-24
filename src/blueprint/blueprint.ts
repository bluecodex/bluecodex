import type { Arg, ValidArg } from "../arg/arg";
import type { Flag, ValidFlag } from "../flag/flag";

export type Blueprint<
  Name extends string = string,
  Fields extends (Arg | Flag)[] = (Arg | Flag)[],
> = {
  __objectType__: "blueprint";
  name: Name;
  fields: Fields;
};

export type ValidBlueprint<
  Name extends string = string,
  Fields extends (ValidArg | ValidFlag)[] = (ValidArg | ValidFlag)[],
> = Blueprint<Name, Fields>;
