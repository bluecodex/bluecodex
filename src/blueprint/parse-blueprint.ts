import type {
  Blueprint,
  BlueprintDefinition,
  BlueprintSchema,
} from "./blueprint";
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
> = Blueprint<Exploded["name"], Exploded["parts"]>;

export function parseBlueprint<Definition extends BlueprintDefinition>(
  definition: Definition,
): ParseBlueprint<Definition> {
  if (typeof definition === "string") {
    const { name, parts } = explodeBlueprintToken(definition);

    return {
      __objectType__: "blueprint",
      name,
      parts,
      schema: {},
    } satisfies Blueprint<any, any> as ParseBlueprint<Definition>;
  }

  const { name, parts } = explodeBlueprintToken(definition[0]);

  return {
    __objectType__: "blueprint",
    name,
    parts,
    schema: definition[1],
  } satisfies Blueprint<any, any> as ParseBlueprint<Definition>;
}
