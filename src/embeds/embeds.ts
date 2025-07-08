import type { Command } from "../command/command";
import { helpCommand } from "./help/helpCommand";
import { initCommand } from "./init/initCommand";
import { initEnvCommand } from "./init/initEnvCommand";

export const embeddedCommands: Command[] = [
  initCommand,
  initEnvCommand,
  helpCommand,
];
