import { configFile } from "../config/config-file";
import { file } from "../file/file";

export async function getLinks() {
  const linksFile = configFile("links.txt");

  if (!(await linksFile.exists())) return [];

  const lines = await linksFile.readLines();

  const validProjectPaths: string[] = [];
  for (const line of lines) {
    if (line && (await file(line).exists())) validProjectPaths.push(line);
  }

  return validProjectPaths;
}
