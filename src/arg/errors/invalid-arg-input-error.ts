import { ioc } from "../../ioc";
import type { Arg } from "../arg";

export class InvalidArgInputError extends Error {
  constructor(
    readonly arg: Arg,
    readonly input: string,
  ) {
    super();
  }

  get message() {
    return ioc.theme.invalidArgInputErrorMessage(this.arg, this.input);
  }
}
