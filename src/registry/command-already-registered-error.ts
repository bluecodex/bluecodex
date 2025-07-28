import type { Command } from "../command/command";
import type { CommandAlias } from "../command/command-alias";
import { ioc } from "../ioc";

export class CommandAlreadyRegisteredError extends Error {
  constructor(readonly commandOrAlias: Command | CommandAlias) {
    super();
  }

  get message() {
    if (this.commandOrAlias.__objectType__ === "command-alias") {
      return ioc.theme.commandAliasAlreadyRegisteredMessage(
        this.commandOrAlias,
      );
    }

    return ioc.theme.commandAlreadyRegisteredMessage(this.commandOrAlias);
  }
}
