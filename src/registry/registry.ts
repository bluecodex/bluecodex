import type { Alias } from "../alias/alias";
import type { Command } from "../command/command";
import { CommandAlreadyRegisteredError } from "./command-already-registered-error";

export class Registry {
  private registeredCommands: Command[] = [];
  private registeredAliases: Alias[] = [];

  private markAsLocalEnabled: boolean = false;
  selfRegisterEnabled: boolean = false;

  get commands(): Command[] {
    // Return a copy to prevent the original array from being manipulated from outside
    return [...this.registeredCommands];
  }

  get aliases(): Alias[] {
    // Return a copy to prevent the original array from being manipulated from outside
    return [...this.registeredAliases];
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

  findAliasedCommand(alias: Alias): Command | undefined {
    return this.registeredCommands.find(
      (registeredCommand) => registeredCommand.blueprint.name === alias.name,
    );
  }

  registeredAliasesForCommand(command: Command): Alias[] {
    return this.registeredAliases.filter(
      (alias) => alias.target === command.blueprint.name,
    );
  }

  findCommandOrAlias(name: string): Command | Alias | undefined {
    return (
      this.registeredCommands.find(
        (command) => command.blueprint.name === name,
      ) ?? this.registeredAliases.find((alias) => alias.name === name)
    );
  }

  registerAlias<A extends Alias>(alias: A): A {
    this.throwIfCommandOrAliasAlreadyRegistered(alias.name);

    const adjustedAlias = this.markAsLocalEnabled
      ? { ...alias, local: true }
      : alias;

    this.registeredAliases.push(adjustedAlias);

    return adjustedAlias;
  }

  selfRegisterAliasIfEnabled<A extends Alias>(alias: A): A {
    if (this.selfRegisterEnabled) {
      return this.registerAlias(alias);
    }

    return alias;
  }
}
