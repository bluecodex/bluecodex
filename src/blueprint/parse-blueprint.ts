import type { Blueprint, BlueprintDefinition } from "./blueprint";
import {
  type ExplodeBlueprintToken,
  explodeBlueprintToken,
} from "./explode-blueprint-token";

export type ParseBlueprint<
  Definition extends BlueprintDefinition,
  Exploded extends ExplodeBlueprintToken<
    Definition extends string ? Definition : Definition[0]
  > = ExplodeBlueprintToken<
    Definition extends string ? Definition : Definition[0]
  >,
> = Blueprint<
  Exploded["name"],
  Exploded["fields"],
  Definition extends string ? {} : Definition[1]
>;

export function parseBlueprint<Definition extends BlueprintDefinition>(
  definition: Definition,
): ParseBlueprint<Definition> {
  if (typeof definition === "string") {
    const { name, fields } = explodeBlueprintToken(definition);

    return {
      __objectType__: "blueprint",
      name,
      fields,
      schema: {},
    } satisfies Blueprint<any, any> as ParseBlueprint<Definition>;
  }

  const { name, fields } = explodeBlueprintToken(definition[0]);

  return {
    __objectType__: "blueprint",
    name,
    fields,
    schema: definition[1] as any,
  } satisfies Blueprint<any, any> as ParseBlueprint<Definition>;
}
