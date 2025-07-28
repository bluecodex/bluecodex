export class InvalidAliasNameError<AliasName extends string> extends Error {
  constructor(readonly aliasName: AliasName) {
    super();
  }

  get message() {
    return `Invalid alias name "${this.aliasName}". It cannot contain spaces`;
  }
}
