import path from "node:path";
import { fileURLToPath } from "node:url";

import type { LooseFilePath } from "./loose-file-path";

export function tightenLooseFilePath(looseFilePath: LooseFilePath): string {
  return path.resolve(
    ...looseFilePath.map((part) => {
      if (Array.isArray(part)) return tightenLooseFilePath(part);

      if (part instanceof URL) return fileURLToPath(part);

      return part;
    }),
  );
}
