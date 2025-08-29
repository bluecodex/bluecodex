import os from "node:os";
import path from "node:path";

import type { LooseFilename } from "./loose-filename";

export function tightenLooseFilename(looseFilename: LooseFilename): string {
  return path.resolve(
    ...looseFilename.map((part) => {
      if (Array.isArray(part)) return tightenLooseFilename(part);

      if (part === "~") return os.homedir();

      if (part.startsWith("~/")) return path.join(os.homedir(), part.slice(2));

      return part;
    }),
  );
}
