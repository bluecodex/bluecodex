import fs from "node:fs/promises";

import { fileExists } from "../utils/fileExists";
import { getLinkedProjectsFilePath } from "./get-linked-projects-file-path";

export async function readLinkedProjectPaths() {
  const filePath = getLinkedProjectsFilePath();

  if (!(await fileExists(filePath))) return [];

  const contents = await fs.readFile(filePath, {
    encoding: "utf-8",
  });

  const lines = contents.split(/\r?\n/);

  const validProjectPaths = [];
  for (const line of lines) {
    if (await fileExists(line)) validProjectPaths.push(line);
  }

  return validProjectPaths;
}
