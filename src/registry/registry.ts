import type { Command } from "../command/command";
import type { CommandAlias } from "../command/command-alias";
import { CommandAlreadyRegisteredError } from "./command-already-registered-error";

export class Registry {
  private registeredCommands: Command[] = [];
  private registeredCommandAliases: CommandAlias[] = [];

  private markAsLocalEnabled: boolean = false;
  selfRegisterEnabled: boolean = false;

  get commands(): Command[] {
    // Return a copy to prevent the original array from being manipulated from outside
    return [...this.registeredCommands];
  }

  get commandAliases(): CommandAlias[] {
    // Return a copy to prevent the original array from being manipulated from outside
    return [...this.registeredCommandAliases];
  }

  async markingAsLocal(fn: () => Promise<void>) {
    this.markAsLocalEnabled = true;
    await fn();
    this.markAsLocalEnabled = false;
  }

  registerCommand<C extends Command>(command: C): C {
    this.throwIfCommandOrAliasAlreadyRegistered(command.blueprint.name);

    const adjustedCommand = this.markAsLocalEnabled
      ? { ...command, meta: { ...command.meta, local: true } }
      : command;

    this.registeredCommands.push(adjustedCommand);

    return adjustedCommand;
  }

  throwIfCommandOrAliasAlreadyRegistered(nameOrAlias: string) {
    const existingCommandOrAlias = this.findCommandOrAlias(nameOrAlias);

    if (existingCommandOrAlias)
      throw new CommandAlreadyRegisteredError(existingCommandOrAlias);
  }

  selfRegisterCommandIfEnabled<C extends Command>(command: C): C {
    return this.selfRegisterEnabled ? this.registerCommand(command) : command;
  }

  findAliasedCommand(commandAlias: CommandAlias): Command | undefined {
    return this.registeredCommands.find(
      (registeredCommand) =>
        registeredCommand.blueprint.name === commandAlias.alias,
    );
  }

  registeredAliasesForCommand(command: Command): CommandAlias[] {
    return this.registeredCommandAliases.filter(
      (registeredCommandAlias) =>
        registeredCommandAlias.target === command.blueprint.name,
    );
  }

  findCommandOrAlias(name: string): Command | CommandAlias | undefined {
    return (
      this.registeredCommands.find(
        (command) => command.blueprint.name === name,
      ) ??
      this.registeredCommandAliases.find(
        (commandAlias) => commandAlias.alias === name,
      )
    );
  }

  registerCommandAlias<CA extends CommandAlias>(commandAlias: CA): CA {
    this.throwIfCommandOrAliasAlreadyRegistered(commandAlias.alias);

    const adjustedCommandAlias = this.markAsLocalEnabled
      ? { ...commandAlias, local: true }
      : commandAlias;

    this.registeredCommandAliases.push(adjustedCommandAlias);

    return adjustedCommandAlias;
  }

  selfRegisterCommandAliasIfEnabled<CA extends CommandAlias>(
    commandAlias: CA,
  ): CA {
    if (this.selfRegisterEnabled) {
      return this.registerCommandAlias(commandAlias);
    }

    return commandAlias;
  }
}
