import fs from "node:fs";
import which from "which";

import { ioc } from "../ioc";
import type { RawCmd } from "./raw-cmd";
import { rawCmdToStringSplit } from "./raw-cmd-to-string-split";

export function rawCmdTarget(rawCmd: RawCmd) {
  const [first, ...rest] = rawCmdToStringSplit(rawCmd);

  if (first === "blue") {
    const [name, ...argv] = rest;

    const command = ioc.registry.findCommand(first);
    if (command) return { type: "command", name, argv, command } as const;
  }

  const binExists = Boolean(which.sync(first, { nothrow: true }));
  if (binExists) return { type: "spawn", name: first, argv: rest } as const;

  const packageBinPath = `node_modules/.bin/${first}`;
  if (fs.existsSync(packageBinPath)) {
    return {
      type: "spawn-package-bin",
      name: first,
      path: packageBinPath,
      argv: rest,
    } as const;
  }

  const command = ioc.registry.findCommand(first);
  if (command) {
    return { type: "command", name: first, argv: rest, command } as const;
  }

  return { type: "not-found", name: first } as const;
}
