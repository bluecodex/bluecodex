import type { Command } from "../command/command";
import { helpCommand } from "./help/helpCommand";
import { initCommand } from "./init/initCommand";

export const embeddedCommands: Command[] = [initCommand, helpCommand];
