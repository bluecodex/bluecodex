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

function printSection(
  data:
    | { type: "embedded"; commands: Command[] }
    | { type: "ungrouped"; commands: Command[] }
    | { type: "grouped"; title: string; commands: Command[] },
) {
  const themedCommands = data.commands
    .map((command) =>
      ioc.theme.command(
        command,
        ioc.registry
          .aliasesForCommand(command)
          .filter((alias) => !alias.meta.misspelling),
      ),
    )
    .filter(Boolean);
  if (!themedCommands) return;

  switch (data.type) {
    case "embedded":
      console.log(ioc.theme.embeddedCommandGroupTitle());
      break;
    case "ungrouped":
      console.log(ioc.theme.ungroupedCommandGroupTitle());
      break;
    case "grouped":
      console.log(ioc.theme.commandGroupTitle(data.title));
      break;
  }

  themedCommands.forEach((themedCommand) => {
    console.log(themedCommand);
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

  printSection({
    type: "embedded",
    commands: embeddedCommands,
  });

  titles.forEach((title) => {
    if (title) {
      printSection({
        type: "grouped",
        title,
        commands: groupedProjectCommands[title],
      });
    } else {
      printSection({
        type: "ungrouped",
        commands: groupedProjectCommands[title],
      });
    }
  });

  const shellAliases = ioc.registry.shellAliases.filter(
    (alias) => !alias.meta.misspelling,
  );
  if (shellAliases.length > 0) {
    console.log(ioc.theme.shellAliasesGroupTitle());

    for (const alias of shellAliases) {
      console.log(["  ", ioc.theme.alias(alias)].join(""));
    }
  }
});
