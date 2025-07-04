export class InvalidFlagTypeError<
  FlagName extends string,
  TypeToken extends string,
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
