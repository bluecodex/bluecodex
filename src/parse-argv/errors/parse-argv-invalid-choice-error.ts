import type { ValidArg } from "../../arg/arg";
import type { ValidFlag } from "../../flag/flag";
import type { PromptSelectChoice } from "../../prompt/prompt";

export class ParseArgvInvalidChoiceError extends Error {
  constructor(
    readonly field: ValidArg | ValidFlag,
    readonly choices: PromptSelectChoice[],
    readonly value: string,
  ) {
    super();
  }

  get message() {
    const choicesString = this.choices
      .map((choice) => (typeof choice === "string" ? choice : choice.value))
      .join(", ");

    return `Invalid choice "${this.value}" for ${this.field.__objectType__} ${this.field.name}. Valid choices: ${choicesString}`;
  }

  get reason() {
    return "invalid choice";
  }
}
