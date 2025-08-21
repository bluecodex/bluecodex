import os from "node:os";

import { getProjectPatterns } from "./get-project-patterns";

export function getDefaultSourcePatterns(projectRoot: string) {
  return [
    ...getProjectPatterns(os.homedir()),
    ...getProjectPatterns(projectRoot),
  ];
}
