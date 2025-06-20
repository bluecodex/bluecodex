import type { Command } from "../command";
import { helpCommand } from "./help/helpCommand";
import { initCommand } from "./init/initCommand";

export const embeds: Command[] = [initCommand, helpCommand];
