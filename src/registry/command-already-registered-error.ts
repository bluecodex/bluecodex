import type { Alias } from "../alias/alias";
import type { Command } from "../command/command";
import { ioc } from "../ioc";

export class CommandAlreadyRegisteredError extends Error {
  constructor(readonly commandOrAlias: Command | Alias) {
    super();
  }

  get message() {
    if (this.commandOrAlias.__objectType__ === "alias") {
      return ioc.theme.aliasAlreadyRegisteredMessage(this.commandOrAlias);
    }

    return ioc.theme.commandAlreadyRegisteredMessage(this.commandOrAlias);
  }
}
