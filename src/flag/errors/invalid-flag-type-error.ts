export class InvalidFlagTypeError<
  FlagName extends string = string,
  TypeToken extends string = string,
> extends Error {
  constructor(
    readonly flagName: FlagName,
    readonly typeToken: TypeToken,
  ) {
    super();
  }

  get message() {
    return `Invalid type "${this.typeToken}" for flag "${this.flagName}"`;
  }
}
