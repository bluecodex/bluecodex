import { embeddedCommand } from "../command/command";
import { ioc } from "../ioc";
import { getLinksFile } from "./get-links-file";

export const linkBlue = embeddedCommand(
  "link",
  {
    description: "Link this project so you can use its commands anywhere",
  },
  async () => {
    const linksFile = getLinksFile();

    const lines = await linksFile.readLines();

    const alreadyIncluded = lines.some((line) => line === ioc.project.rootPath);
    if (alreadyIncluded) {
      console.log("This project is already linked");
      return;
    }

    lines.push(ioc.project.rootPath);
    await linksFile.save(lines.filter(Boolean).join("\n"));
  },
);
