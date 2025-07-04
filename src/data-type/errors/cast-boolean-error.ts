export class CastBooleanError<Token extends string = string> extends Error {
  constructor(readonly token: Token) {
    super();
  }

  get message() {
    return `Unable to cast "${this.token}" to boolean`;
  }
}
