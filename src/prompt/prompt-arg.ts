import type { Arg } from "../arg/arg";
import type { Command } from "../command/command";

type Args = {
  command: Command;
  arg: Arg;
};

export function promptArg({ command, arg }: Args) {
  switch (arg.type) {
    case "string":
    case "boolean":
    case "number":
  }
}
