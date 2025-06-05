import type { Command } from "./types/Command";

export class CommandRegistry {
  private registeredCommands: Command[] = [];
  selfRegisterEnabled: boolean = false;

  get commands(): Command[] {
    return this.registeredCommands;
  }

  register(command: Command): Command {
    if (this.find(command.name)) {
      throw new Error(`Command with name "${command.name}" already exists.`);
    }

    this.registeredCommands.push(command);
    return command;
  }

  selfRegisterIfEnabled(command: Command): Command {
    return this.selfRegisterEnabled ? this.register(command) : command;
  }

  find(name: string): Command | undefined {
    return this.registeredCommands.find((command) => command.name === name);
  }
}
