import os from "node:os";
import path from "node:path";

import { configFile } from "./config-file";
import { findShellProfileFile } from "./find-shell-profile-file";

export async function addSourceConfigResolverInstructionToShellProfile() {
  const profileFile = await findShellProfileFile();

  const previousContents = (await profileFile.exists())
    ? await profileFile.read()
    : "";

  const configShFile = configFile("shell.sh");
  const configShFilePathRelativeToHome =
    "~/" + path.relative(os.homedir(), configShFile.path);

  const sourceInstruction = `source ${configShFilePathRelativeToHome}`;
  if (previousContents.includes(sourceInstruction))
    return { sourceInstruction };

  await profileFile.save(
    [
      ...(previousContents ? [previousContents] : ""),
      "",
      "# Bluecodex",
      sourceInstruction,
    ].join("\n"),
  );

  return { sourceInstruction };
}
