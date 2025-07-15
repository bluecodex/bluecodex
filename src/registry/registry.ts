import type { Command } from "../command/command";

export class Registry {
  private registeredCommands: Command[] = [];
  private markCommandsAsLocalEnabled: boolean = false;
  selfRegisterCommandEnabled: boolean = false;

  get commands(): Command[] {
    return [...this.registeredCommands];
  }

  async markingRegisteredCommandsAsLocal(fn: () => Promise<void>) {
    this.markCommandsAsLocalEnabled = true;
    await fn();
    this.markCommandsAsLocalEnabled = false;
  }

  registerCommand<C extends Command>(command: C): C {
    if (this.findCommand(command.blueprint.name)) {
      throw new Error(
        `Command with name "${command.blueprint.name}" already exists.`,
      );
    }

    const adjustedCommand = this.markCommandsAsLocalEnabled
      ? { ...command, meta: { ...command.meta, local: true } }
      : command;

    this.registeredCommands.push(adjustedCommand);

    return adjustedCommand;
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
