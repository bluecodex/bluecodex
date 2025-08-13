import { assertArgIsValid } from "../arg/assert-arg-is-valid";
import { assertFlagIsValid } from "../flag/assert-flag-is-valid";
import type { Blueprint, ValidBlueprint } from "./blueprint";

export function assertBlueprintIsValid(
  blueprint: Blueprint,
): asserts blueprint is ValidBlueprint {
  blueprint.fields.forEach((field) => {
    if (field.__objectType__ === "arg") assertArgIsValid(field);
    else assertFlagIsValid(field);
  });
}
