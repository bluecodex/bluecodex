import { file } from "../file/file";

export function configFile(
  filename: "shell.sh" | "resolver.mjs" | "links.txt",
) {
  return file("~/.config/bluecodex", filename);
}
