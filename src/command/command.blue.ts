import { casexTemplate } from "casex-template";

import { fyle } from "../fyle/fyle";
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
    const templateFile = fyle(__dirname, "templates/simple", templateFilename);

    const targetFile = fyle(
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
