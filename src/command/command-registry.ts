import type { Command } from "./command";

export class CommandRegistry {
  private registeredCommands: Command[] = [];
  selfRegisterEnabled: boolean = false;

  get commands(): Command[] {
    return [...this.registeredCommands];
  }

  register<C extends Command>(command: C): C {
    if (this.find(command.blueprint.name)) {
      throw new Error(
        `Command with name "${command.blueprint.name}" already exists.`,
      );
    }

    this.registeredCommands.push(command);
    return command;
  }

  selfRegisterIfEnabled<C extends Command>(command: C): C {
    return this.selfRegisterEnabled ? this.register(command) : command;
  }

  find(name: string): Command | undefined {
    return this.registeredCommands.find(
      (command) => command.blueprint.name === name,
    );
  }
}
