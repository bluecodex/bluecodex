import type { Command } from "../command";
import { command_list } from "./command/command_list";
import { init } from "./init/init";

export const embeds: Command[] = [init, command_list];
