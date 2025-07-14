import { type Command, command } from "../../command/command";
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
  subtitle,
  commands,
}: {
  title: string;
  subtitle: string | null;
  commands: Command[];
}) {
  const themedCommands = commands
    .map((command) => ioc.theme.command(command))
    .filter(Boolean);
  if (!themedCommands) return;

  console.log(ioc.theme.commandGroup(title, subtitle));

  themedCommands.forEach((themedCommand) => {
    console.log(themedCommand);
  });

  console.log(""); // Some breathing room
}

export const helpCommand = command("help", () => {
  console.log(""); // Some breathing room

  const allCommands = ioc.registry.commands;
  const groupedProjectCommands = groupCommands(
    allCommands.filter((command) => !embeddedCommands.includes(command)),
  );

  const titles = Object.keys(groupedProjectCommands).sort();

  printGroup({
    title: "embedded",
    subtitle: null,
    commands: embeddedCommands,
  });

  titles.forEach((title) => {
    if (title) {
      printGroup({
        title,
        subtitle: null,
        commands: groupedProjectCommands[title],
      });
    } else {
      printGroup({
        title: "project",
        subtitle: "(no group)",
        commands: groupedProjectCommands[title],
      });
    }
  });
});
