import type { Command } from "../command/command";
import type { Flag } from "../flag/flag";

type Args = {
  command: Command;
  flag: Flag;
};

export function promptFlag({ command, flag }: Args) {}
