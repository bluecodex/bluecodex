import { embeddedCommand } from "../command/command";
import { configFile } from "../config/config-file";
import { ioc } from "../ioc";
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
  },
);
