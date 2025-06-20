import chalk from "chalk";

import { formatArg } from "../../arg";
import { command } from "../../command";
import { formatFlag } from "../../flag";
import { ioc } from "../../ioc";

export const helpCommand = command("help", () => {
  console.log(""); // Some breathing room

  const { groupedCommands } = ioc.project;

  const groupNames = Object.keys(groupedCommands).sort();

  groupNames.forEach((groupName) => {
    if (groupName) console.log(chalk.blueBright(groupName));

    const commands = groupedCommands[groupName];
    commands.forEach(({ blueprint }) => {
      const prefix = groupName
        ? `  ${chalk.dim.greenBright(`${groupName}:`)}`
        : "";
      const remainingName = groupName
        ? blueprint.name.slice(`${groupName}:`.length)
        : blueprint.name;

      const formattedName = chalk.greenBright(remainingName);
      const formattedArgs = blueprint.args.map(formatArg).join(" ");
      const formattedFlags = blueprint.flags.map(formatFlag).join(" ");

      console.log(
        `${prefix}${formattedName} ${formattedArgs} ${formattedFlags}`,
      );
    });

    console.log(""); // Some breathing room
  });
});
