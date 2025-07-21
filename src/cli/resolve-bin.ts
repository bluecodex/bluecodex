import { execSync } from "node:child_process";
import fs from "node:fs";

import { ioc } from "../ioc";
import type { RawCmd } from "./raw-cmd";
import { rawCmdToStringSplit } from "./raw-cmd-to-string-split";

export function resolveBin(rawCmd: RawCmd) {
  const [first, ...rest] = rawCmdToStringSplit(rawCmd);

  if (first === "blue") {
    const [name, ...argv] = rest;
    return { type: "command", name, argv } as const;
  }

  try {
    return {
      type: "spawn",
      name: execSync(`which ${first}`, { encoding: "utf-8" }).trim(),
      argv: rest,
    } as const;
  } catch {
    const binPath = `node_modules/.bin/${first}`;
    if (fs.existsSync(binPath))
      return {
        type: "spawn-package-bin",
        name: first,
        path: binPath,
        argv: rest,
      } as const;

    const command = ioc.registry.findCommand(first);
    if (command) {
      return { type: "command", name: first, argv: rest } as const;
    }
  }

  return { type: "not-found", name: first } as const;
}
