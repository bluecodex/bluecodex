import { ioc } from "./ioc";
import type { Command, CommandFn } from "./types/Command";

type Args = {
  name: string;
  fn: CommandFn;
};

export function command({ name, fn }: Args): Command {
  return ioc.commandRegistry.selfRegisterIfEnabled({ name, fn });
}
