import { fyle } from "../fyle/fyle";
import { getLinksFilePath } from "./get-links-file-path";

export async function readLinks() {
  const linksFile = fyle(getLinksFilePath());

  if (!(await linksFile.exists())) return [];

  const lines = await linksFile.readLines();

  const validProjectPaths = [];
  for (const line of lines) {
    if (await fyle(line).exists()) validProjectPaths.push(line);
  }

  return validProjectPaths;
}
