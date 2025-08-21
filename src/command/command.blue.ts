import { casexTemplate } from "casex-template";

import { file } from "../file/file";
import { ioc } from "../ioc";
import { embeddedCommand } from "./command";
import { ensureLocalGitIgnore } from "./ensure-local-git-ignore";

export const commandBlue = embeddedCommand(
  "command name --local",
  {
    description: "Create a new *.blue.ts file for your command",
  },
  async ({ name, local }) => {
    if (local) await ensureLocalGitIgnore();

    const templateFilename = "__na-me__.blue.ts";
    const templateFile = file(__dirname, "templates/simple", templateFilename);

    const targetFile = file(
      ioc.project.rootPath,
      ".blue",
      local ? "local" : "",
      casexTemplate({ name, text: templateFilename }),
    );

    await targetFile.save(
      casexTemplate({
        name,
        text: (await templateFile.read()).replace("../../command", "bluecodex"),
      }),
    );
  },
);
