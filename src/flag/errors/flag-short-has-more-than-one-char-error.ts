export class FlagShortHasMoreThanOneCharError<
  FlagName extends string = string,
  ShortToken extends string = string,
> extends Error {
  constructor(
    readonly flagName: FlagName,
    readonly shortToken: ShortToken,
  ) {
    super();
  }

  get message() {
    return `The short of a long flag can only have one character, given "${this.shortToken}" for flag "${this.flagName}"`;
  }
}
