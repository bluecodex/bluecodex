import { casexTemplate } from "casex-template";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

    const templateFilename = "__na---__.blue.ts";
    const templatePath = path.join(
      fileURLToPath(import.meta.url),
      "simple",
      templateFilename,
    );

    const fileName = casexTemplate({ name, text: templateFilename });
    await fyle(
      path.join(ioc.project.rootPath, ".blue", local ? ".local" : "", fileName),
    ).save(
      casexTemplate({
        name,
        text: (await fyle(templatePath).read()).replace(
          "../../command",
          "bluecodex",
        ),
      }),
    );
  },
);
