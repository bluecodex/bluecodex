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

  get commandByName(): Partial<Record<string, Command>> {
    const commandByName: Partial<Record<string, Command>> = {};
    for (const command of this.commands) {
      commandByName[command.blueprint.name] = command;
    }

    return commandByName;
  }

  get aliases(): Alias[] {
    // Return a copy to prevent the original array from being manipulated from outside
    return [...this.registeredAliases];
  }

  get aliasByName(): Partial<Record<string, Alias>> {
    const aliasByName: Partial<Record<string, Alias>> = {};
    for (const alias of this.aliases) {
      aliasByName[alias.name] = alias;
    }

    return aliasByName;
  }

  /**
   * Aliases that do not point to a command, therefore it points to a system executable
   */
  get shellAliases(): Alias[] {
    const commandByName = this.commandByName;

    return this.aliases.filter((alias) => !commandByName[alias.target]);
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
    return this.commandByName[alias.target];
  }

  aliasesForCommand(command: Command): Alias[] {
    return this.registeredAliases.filter(
      (alias) => alias.target === command.blueprint.name,
    );
  }

  findCommandOrAlias(name: string): Command | Alias | undefined {
    return this.commandByName[name] ?? this.aliasByName[name];
  }

  registerAlias<A extends Alias>(alias: A): A {
    this.throwIfCommandOrAliasAlreadyRegistered(alias.name);

    const adjustedAlias = this.markAsLocalEnabled
      ? { ...alias, meta: { ...alias.meta, local: true } }
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
