import { casex } from "casex";
import chalk from "chalk";

import { formatArg } from "../../arg";
import { isFlag } from "../../blueprint";
import { type Command, command } from "../../command";
import { formatFlag } from "../../flag";
import { ioc } from "../../ioc";
import { embeddedCommands } from "../embeds";

function groupCommands(commands: Command[]) {
  const groups: Record<string, Command[]> = {};

  commands.forEach((command) => {
    const [first, ...rest] = command.blueprint.name.split(":");

    const groupName = rest.length > 0 ? first : "";
    groups[groupName] ||= [];
    groups[groupName].push(command);
  });

  return groups;
}

function printGroup({
  title,
  titleSuffix,
  commands,
}: {
  title: string;
  titleSuffix?: string;
  commands: Command[];
}) {
  console.log(
    [chalk.cyan(title), titleSuffix && chalk.cyan.dim(titleSuffix)]
      .filter(Boolean)
      .join(" "),
  );

  commands.forEach(({ blueprint }) => {
    const formattedName = chalk.blueBright(blueprint.name);
    const formattedParts = blueprint.parts
      .map((part) => (isFlag(part) ? formatFlag(part) : formatArg(part)))
      .join(" ");

    console.log(`  ${formattedName} ${chalk.white(formattedParts)}`);
  });

  console.log(""); // Some breathing room
}

export const helpCommand = command("help", () => {
  console.log(""); // Some breathing room

  const allCommands = ioc.commandRegistry.commands;
  const groupedProjectCommands = groupCommands(
    allCommands.filter((command) => !embeddedCommands.includes(command)),
  );

  const titles = Object.keys(groupedProjectCommands).sort();

  printGroup({
    title: "Bluecodex",
    titleSuffix: "(embedded)",
    commands: embeddedCommands,
  });

  titles.forEach((title) => {
    if (title) {
      printGroup({
        title: casex({ text: title, pattern: "Ca Se" }),
        commands: groupedProjectCommands[title],
      });
    } else {
      printGroup({
        title: "Project",
        titleSuffix: "(no group)",
        commands: groupedProjectCommands[title],
      });
    }
  });
});
