import { embeddedCommand } from "../command/command";
import { configFile } from "../config/config-file";
import { configBlue } from "../config/config.blue";
import { ioc } from "../ioc";
import { run } from "../run/run";
import { themedBluecodexBrand } from "../theme/themedBluecodexBrand";
import { getLinks } from "./get-links";

export const linkBlue = embeddedCommand(
  "link",
  {
    description: "Link this project so you can use its commands anywhere",
  },
  async () => {
    const links = await getLinks();

    const alreadyIncluded = links.some((line) => line === ioc.project.rootPath);

    if (alreadyIncluded) {
      console.log("This project is already linked");
      return;
    }

    links.push(ioc.project.rootPath);
    await configFile("links.txt").save(links);

    const isConfigured = await configFile("resolver.mjs").exists();
    if (!isConfigured) {
      console.log("");
      console.log(`You have not ran ${ioc.theme.commandName(configBlue)} yet.`);
      console.log(
        `That's a necessary step for running ${themedBluecodexBrand} from other places.`,
      );
      console.log("We'll go ahead and run it for you.");
      await run(configBlue.blueprint.name);
    }
  },
);
