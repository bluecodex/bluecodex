export class FlagShortMalformattedError<
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
    return `Invalid short format "${this.shortToken}" for flag "${this.flagName}"`;
  }
}
