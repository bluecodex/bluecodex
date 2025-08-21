import path from "node:path";

export function getLinkedProjectsFilePath() {
  return path.resolve("~/.config/bluecodex/linked-projects.txt");
}
