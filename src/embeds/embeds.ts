import type { Command } from "../command";
import { helpCommand } from "./help/helpCommand";
import { initCommand } from "./init/initCommand";

export const embeddedCommands: Command[] = [initCommand, helpCommand];
