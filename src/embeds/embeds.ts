import type { Command } from "../types/Command";
import { initCommand } from "./init/init-command";
import { listCommand } from "./list/listCommand";

export const embeds: Command[] = [initCommand, listCommand];
