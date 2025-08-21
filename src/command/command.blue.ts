import { casexTemplate } from "casex-template";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { fyle } from "../fyle/fyle";
import { ioc } from "../ioc";
import { embeddedCommand } from "./command";
import { ensureLocalGitIgnore } from "./ensure-local-git-ignore";

export const commandBlue = embeddedCommand(
  "command name --location!:string",
  {
    description: "Create a new *.blue.ts file for your command",
    location: {
      message: "Would you like to create this file just for yourself",
      validate: [
        {
          value: "local",
          description: ".blue/local/*.ts (git ignored)",
        },
        {
          value: "project",
          description: ".blue/*.ts",
        },
      ],
    },
  },
  async ({ name, location }) => {
    if (location === "local") await ensureLocalGitIgnore();

    const templateFilename = "__na---__.blue.ts";
    const templatePath = path.join(
      fileURLToPath(import.meta.url),
      "simple",
      templateFilename,
    );

    const fileName = casexTemplate({ name, text: templateFilename });
    await fyle(
      path.join(
        ioc.project.rootPath,
        ".blue",
        location === "local" ? ".local" : "",
        fileName,
      ),
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
