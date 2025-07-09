import chalk from "chalk";

import { formatArg } from "../../arg/format-arg";
import { type Command, command } from "../../command/command";
import { formatFlag } from "../../flag/format-flag";
import { ioc } from "../../ioc";
import { embeddedCommands } from "../embeds";

function groupCommands(commands: Command[]) {
  const groups: Record<string, Command[]> = {};

  const ungroupedCommands: Command[] = [];

  commands.forEach((command) => {
    const [first, ...rest] = command.blueprint.name.split(":");

    if (rest.length === 0) {
      ungroupedCommands.push(command);
      return;
    }

    const groupName = rest.length > 0 ? first : "";
    groups[groupName] ??= [];
    groups[groupName].push(command);
  });

  // Include command that has the same name as the group
  // Example: "lint", "lint:css", "lint:js"
  ungroupedCommands.forEach((command) => {
    if (groups[command.blueprint.name]) {
      groups[command.blueprint.name].unshift(command);
    } else {
      groups[""] ??= [];
      groups[""].push(command);
    }
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
      .map((part) =>
        part.__objectType__ === "flag" ? formatFlag(part) : formatArg(part),
      )
      .join(" ");

    console.log(`  ${formattedName} ${chalk.white(formattedParts)}`);
  });

  console.log(""); // Some breathing room
}

export const helpCommand = command("help", () => {
  console.log(""); // Some breathing room

  const allCommands = ioc.registry.commands.filter(
    (command) => !command.meta.todo,
  );
  const groupedProjectCommands = groupCommands(
    allCommands.filter((command) => !embeddedCommands.includes(command)),
  );

  const titles = Object.keys(groupedProjectCommands).sort();

  printGroup({
    title: "bluecodex",
    titleSuffix: "(embedded)",
    commands: embeddedCommands,
  });

  titles.forEach((title) => {
    if (title) {
      printGroup({ title, commands: groupedProjectCommands[title] });
    } else {
      printGroup({
        title: "project",
        titleSuffix: "(no group)",
        commands: groupedProjectCommands[title],
      });
    }
  });
});
