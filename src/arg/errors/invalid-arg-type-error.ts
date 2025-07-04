export class InvalidArgTypeError<
  ArgName extends string,
  TypeToken extends string,
> extends Error {
  constructor(
    readonly argName: ArgName,
    readonly typeToken: TypeToken,
  ) {
    super();
  }

  get message() {
    return `Invalid type "${this.typeToken}" for arg "${this.argName}"`;
  }
}
