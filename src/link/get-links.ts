import { file } from "../file/file";
import { getLinksFilePath } from "./get-links-file-path";

export async function getLinks() {
  const linksFile = file(getLinksFilePath());

  if (!(await linksFile.exists())) return [];

  const lines = await linksFile.readLines();

  const validProjectPaths = [];
  for (const line of lines) {
    if (await file(line).exists()) validProjectPaths.push(line);
  }

  return validProjectPaths;
}
