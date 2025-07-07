import chalk from "chalk";

import type { Flag } from "./flag";

export function formatFlag(flag: Flag) {
  const formattedParts: string[] = [];

  formattedParts.push(chalk(`${flag.short === true ? "-" : "--"}${flag.name}`));

  if (flag.required) formattedParts.push("!");

  if (typeof flag.short === "string")
    formattedParts.push(chalk.dim(`(-${flag.short})`));

  if (flag.explicitType) formattedParts.push(chalk.dim(`:${flag.type}`));

  if (flag.fallback !== null)
    formattedParts.push(chalk.dim(`=${flag.fallback}`));

  return formattedParts.join("");
}
