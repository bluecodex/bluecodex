import type { Command } from "../command/command";
import { helpCommand } from "./help/help-command";
import { initCommand } from "./init/init-command";

export const embeddedCommands: Command[] = [initCommand, helpCommand];
