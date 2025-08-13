import type { ValidArg } from "../../arg/arg";
import type { ValidFlag } from "../../flag/flag";
import { ioc } from "../../ioc";

export class ParseArgvMalformattedInputError extends Error {
  constructor(
    readonly field: ValidArg | ValidFlag,
    readonly input: string,
  ) {
    super();
  }

  get message() {
    return ioc.theme.parseArgvMalformattedInputErrorMessage(this);
  }

  get reason() {
    return "malformatted input";
  }
}
