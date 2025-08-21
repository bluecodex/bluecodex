import { fyle } from "../fyle/fyle";
import { ioc } from "../ioc";

export async function ensureLocalGitIgnore() {
  const localGitIgnoreFile = fyle(
    ioc.project.localBlueFolderPath,
    ".gitignore",
  );

  if (await localGitIgnoreFile.exists()) return;

  await localGitIgnoreFile.save(
    [
      "# You can use this folder to make customizations",
      "# or experiment with new commands before you share with your team.",
      "",
      "# Files in this folder are not tracked on git",
      "*",
      "",
    ],
    { log: true },
  );
}
