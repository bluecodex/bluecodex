import chalk from "chalk";

import type { Arg } from "./arg";

export function formatArg(arg: Arg) {
  const formattedParts: string[] = [];

  formattedParts.push(arg.optional ? chalk.dim(`${arg.name}?`) : arg.name);
  if (arg.explicitType) formattedParts.push(chalk.dim(`:${arg.type}`));
  if (arg.fallback !== null) formattedParts.push(chalk.dim(`=${arg.fallback}`));

  return formattedParts.join("");
}
