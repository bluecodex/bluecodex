export class MalformattedAliasError<AliasToken extends string> extends Error {
  constructor(readonly aliasToken: AliasToken) {
    super();
  }

  get message() {
    return `Invalid format for alias token "${this.aliasToken}". It must be "name=target"`;
  }
}
