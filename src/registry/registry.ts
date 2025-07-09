import type { Command } from "../command/command";

export class Registry {
  private registeredCommands: Command[] = [];
  selfRegisterCommandEnabled: boolean = false;

  get commands(): Command[] {
    return [...this.registeredCommands];
  }

  registerCommand<C extends Command>(command: C): C {
    if (this.findCommand(command.blueprint.name)) {
      throw new Error(
        `Command with name "${command.blueprint.name}" already exists.`,
      );
    }

    this.registeredCommands.push(command);
    return command;
  }

  selfRegisterCommandIfEnabled<C extends Command>(command: C): C {
    return this.selfRegisterCommandEnabled
      ? this.registerCommand(command)
      : command;
  }

  findCommand(name: string): Command | undefined {
    return this.registeredCommands.find(
      (command) => command.blueprint.name === name,
    );
  }
}
