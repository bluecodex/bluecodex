import { file } from "../file/file";
import { getLinksFile } from "./get-links-file";

export async function getLinks() {
  const linksFile = getLinksFile();

  if (!(await linksFile.exists())) return [];

  const lines = await linksFile.readLines();

  const validProjectPaths = [];
  for (const line of lines) {
    if (line && (await file(line).exists())) validProjectPaths.push(line);
  }

  return validProjectPaths;
}
